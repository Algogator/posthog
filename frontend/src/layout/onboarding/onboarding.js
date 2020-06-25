import React, { useState, useEffect, useRef } from 'react'
import { Popover, Button, Checkbox, Badge, Modal } from 'antd'
import { useValues, useActions } from 'kea'
import { actionsModel } from '~/models/actionsModel'
import { Loading } from 'lib/utils'
import { StarOutlined, StarFilled } from '@ant-design/icons'
import { Link } from 'lib/components/Link'
import FunnelImage from '../_assets/funnel_with_text.png'
import ActionImage from '../_assets/actions.png'
import TrendImage from '../_assets/trend.png'
import { onboardingLogic, TourType } from './onboardingLogic'
import { userLogic } from 'scenes/userLogic'
import _ from 'lodash'
import api from 'lib/api'

export function OnboardingWidget() {
    const contentRef = useRef()
    const { actions, actionsLoading } = useValues(actionsModel)
    const [instructionalModal, setInstructionalModal] = useState(false)
    const { user } = useValues(userLogic)
    const { loadUser } = useActions(userLogic)
    const { tourType, checked } = useValues(onboardingLogic({ user }))
    const { setTourActive, setTourType, updateOnboardingInitial } = useActions(onboardingLogic)
    const [visible, setVisible] = useState(user.onboarding.initial ? true : false)

    const unfinishedCount = _.filter(checked, isChecked => !isChecked).length

    function closePopup() {
        if (user.onboarding.initial) updateOnboardingInitial(false)
        setVisible(false)
    }

    let onClickOutside = event => {
        if (contentRef.current && !contentRef.current.contains(event.target)) {
            closePopup()
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', onClickOutside)
        return () => {
            document.removeEventListener('mousedown', onClickOutside)
        }
    }, [])

    async function dontShowAgain() {
        await api.update('api/user', { onboarding: { ...user.onboarding, active: false } })
        loadUser()
    }

    function content() {
        return (
            <div
                data-attr="onboarding-content"
                ref={contentRef}
                style={{ display: 'flex', width: '25vw', flexDirection: 'column' }}
            >
                <h2>Get Started</h2>
                <i>
                    Complete these steps to learn how to use Posthog! Click on an item below to learn how to create one
                </i>
                {Object.entries(TourType).map(([, value], index) => {
                    return (
                        <div key={index}>
                            <hr style={{ height: 3, visibility: 'hidden' }} />
                            <Link
                                onClick={() => {
                                    closePopup()
                                    setInstructionalModal(true)
                                    setTourType(value)
                                }}
                                data-attr={'onboarding-item-' + index}
                            >
                                <Checkbox
                                    style={{ marginRight: 12 }}
                                    checked={user.onboarding.steps[index] || checked[index]}
                                ></Checkbox>
                                <span>{value}</span>
                            </Link>
                        </div>
                    )
                })}
                <hr style={{ height: 5, visibility: 'hidden' }} />
                {unfinishedCount > 0 ? (
                    <p onClick={dontShowAgain} style={{ color: 'gray', cursor: 'pointer' }}>
                        Don't show this again
                    </p>
                ) : (
                    <Button onClick={dontShowAgain} type={'primary'}>
                        Done
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div>
            <Popover
                visible={visible}
                content={actionsLoading ? <Loading></Loading> : content({ actions })}
                trigger="click"
            >
                <Badge count={unfinishedCount}>
                    <Button data-attr="onboarding-button" onClick={() => (visible ? closePopup() : setVisible(true))}>
                        {unfinishedCount === 0 ? <StarFilled></StarFilled> : <StarOutlined></StarOutlined>}
                    </Button>
                </Badge>
            </Popover>
            <Modal
                visible={instructionalModal}
                style={{ minWidth: '50%' }}
                bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                footer={null}
                onCancel={() => setInstructionalModal(false)}
            >
                <img data-attr="onboarding-image" style={{ maxWidth: '100%' }} src={ModalContent[tourType].src}></img>
                <h1 style={{ textAlign: 'center' }}>{ModalContent[tourType].title}</h1>
                <p style={{ textAlign: 'center', fontSize: 16, fontWeight: 500, maxWidth: '60%' }}>
                    {ModalContent[tourType].description}
                </p>
                <Button data-attr="onboarding-start-flow-button" type="primary" style={{ textAlign: 'center' }}>
                    <Link
                        to={ModalContent[tourType].link}
                        onClick={() => {
                            setInstructionalModal(false)
                            closePopup()
                            setTimeout(() => setTourActive(), 500)
                        }}
                    >
                        {ModalContent[tourType].buttonText}
                    </Link>
                </Button>
            </Modal>
        </div>
    )
}

const ModalContent = {
    [TourType.ACTION]: {
        src: ActionImage,
        title: 'Actions',
        description:
            'Events can get overwhelming. Use actions to filter and group events you want to analyze as a distinct entity.',
        link: '/action',
        buttonText: 'Get Started',
    },
    [TourType.TRENDS]: {
        src: TrendImage,
        title: 'Trends',
        description: 'Trends show you aggregate data on actions and events',
        link: '/trends',
        buttonText: 'Get Started',
    },
    [TourType.FUNNEL]: {
        src: FunnelImage,
        title: 'Funnels',
        description: 'Funnels are used to understand how your users are converting from one step to the next.',
        link: '/funnel/new',
        buttonText: 'Get Started',
    },
}
