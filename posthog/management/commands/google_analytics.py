import json
import os
import pickle
from datetime import datetime
from typing import Dict, List, Union

import requests
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from posthog.management.commands.google_analytics_util.constants import (
    API_KEY, CREDENTIALS_FILE_PATH,
    DIMENSIONS, END_DATE, EVENT_NAME,
    GA_ID, HOST, METRICS, START_DATE
)

from django.core.management.base import BaseCommand

SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']

class Command(BaseCommand):
    help = 'Import google analytics data'


    def build_credentials(self, path: str, scopes: List[str]) -> Credentials:
        """Build credentials for google analytics authentication

        :param path: path to the local credentials file
        :type path: str
        :param scopes: scopes that will be authorized using OAuth2
        :type scopes: List[str]
        :return: Credentials for google
        :rtype: Credentials
        """
        creds = None
        if os.path.exists('./token.pickle'):
            with open('./token.pickle', 'rb') as token:
                creds = pickle.load(token)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    path,
                    scopes,
                )
                creds = flow.run_console()

            with open('./token.pickle', 'wb') as token:
                pickle.dump(creds, token)

        return creds


    def get_data_from_google_analytics(
        self,
        credentials_file_path: str,
        scopes: List[str],
        end_date: str,
        start_date: str,
        ga_id: str,
        metrics: str,
        dimensions: str,
    ) -> Dict[str, Union[List[str], str, Dict[str, str]]]:
        """Get data from google analytics using the core reporting api v3

        :param credentials_file_path: Path to google created credentials
        :type credentials_file_path: str
        :param scopes: Scope for the authorization
        :type scopes: List[str]
        :param end_date: End date for the google analytics import
        :type end_date: str
        :param start_date: Start date for the google analytics import
        :type start_date: str
        :param ga_id: ID from Google analytics
        :type ga_id: str
        :param metrics: Metrics to be extracted
        :type metrics: str
        :param dimensions: Dimensions to be extracted
        :type dimensions: str
        :return: Object with response.
        :rtype: Dict[str, Union[List[str], str, Dict[str, str]]]
        """
        service = build(
            'analytics',
            'v3',
            credentials=self.build_credentials(credentials_file_path, scopes)
        )

        service.management().accounts().list().execute()

        return service.data().ga().get(
            end_date=end_date,
            start_date=start_date,
            ids=ga_id,
            metrics=metrics,
            dimensions=dimensions,
        ).execute()


    def transform_data_for_import(
        self,
        _result: Dict[str, Union[List[str], str, Dict[str, str]]],
        event_name: str
    ) -> List[Dict[str, Union[str, int]]]:
        """Prepare data to be ingested by Posthog.

        :param result: Result obtained from the google analytics export.
        :type result: Dict[str, Union[List[str], str, Dict[str, str]]]
        :param event_name: Name of the event being saved.
        : type event_name: str
        :return: Data on the Posthog ingestion format.
        :rtype: List[Dict[str, Union[str, int]]
        """
        column_names = [col['name'] for col in _result['columnHeaders']]
        batch_data   = []

        for row in _result['rows']:
            for pageviewCount in range(0, int(row[column_names.index('ga:pageviews')])):
                row_dictionary = {}
                row_dictionary['properties'] = {}

                row_dictionary['properties']['$current_url'] = row[column_names.index('ga:pagePath')]

                row_dictionary['event'] = 'pageview'

                if 'ga:date' in column_names:
                    row_dictionary['timestamp'] = row[column_names.index('ga:date')]
                else:
                    row_dictionary['timestamp'] = datetime.now()

                batch_data.append(row_dictionary)

        return batch_data


    def send_data_to_posthog(
        self,
        batch_data: List[Dict[str, Union[str, int]]],
        api_key: str,
        host: str
    ) -> requests.Response:
        """Send the Google Analytics data to Posthog

        :param data: Data prepared for posthog ingestion
        :type data: List[Dict[str, Union[str, int]]
        :param api_key: Api key provided by posthog
        :type api_key: str
        :param host: Host of your local instance
        :type host: str
        :return: Answer from the posthog server
        :rtype: requests.Response
        """
        data = {
            "api_key": api_key,
            "batch":   batch_data,
        }

        request = requests.post(
            host + "/capture/",
            data=json.dumps(data),
            headers={'Content-Type': 'application/json'},
        )

        return request

    def handle(self, *args, **options):
        result = self.get_data_from_google_analytics(
            CREDENTIALS_FILE_PATH,
            SCOPES,
            END_DATE,
            START_DATE,
            GA_ID,
            METRICS,
            DIMENSIONS
        )
        data = self.transform_data_for_import(result, EVENT_NAME)
        self.send_data_to_posthog(data, API_KEY, HOST)
