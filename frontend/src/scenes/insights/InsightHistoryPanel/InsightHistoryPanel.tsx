import React, { useState } from 'react'
import { Tabs, Table, Modal, Input, Button } from 'antd'
import { useValues, useActions } from 'kea'
import { insightsModel } from '~/models/insightsModel'
import { humanFriendlyDetailedTime, toParams } from 'lib/utils'
import { Link } from 'lib/components/Link'
import { PushpinOutlined } from '@ant-design/icons'

const InsightHistoryType = {
    SAVED: 'SAVED',
    RECENT: 'RECENT',
}

const { TabPane } = Tabs

export const InsightHistoryPanel: React.FC = () => {
    const { insights, savedInsights, insightsLoading, savedInsightsLoading } = useValues(insightsModel)
    const { saveInsight } = useActions(insightsModel)
    const [visible, setVisible] = useState(false)
    const [activeTab, setActiveTab] = useState(InsightHistoryType.RECENT)
    const [selectedInsight, setSelectedInsight] = useState<number | null>(null)

    const savedColumns = [
        {
            title: 'Name',
            key: 'id',
            render: function RenderName(_, insight) {
                return <Link to={'/insights?' + toParams(insight.filters)}>{insight.name}</Link>
            },
        },
    ]

    const recentColumns = [
        {
            title: 'Type',
            key: 'id',
            render: function RenderType(_, insight) {
                return <Link to={'/insights?' + toParams(insight.filters)}>{insight.filters.insight}</Link>
            },
        },
        {
            title: 'Timestamp',
            render: function RenderVolume(_, insight) {
                return <span>{humanFriendlyDetailedTime(insight.created_at)}</span>
            },
        },
        {
            render: function RenderAction(_, insight) {
                return (
                    <PushpinOutlined
                        onClick={() => {
                            setVisible(true)
                            setSelectedInsight(insight.id)
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                )
            },
        },
    ]

    return (
        <Tabs
            style={{
                overflow: 'visible',
            }}
            animated={false}
            activeKey={activeTab}
            onChange={(activeKey: string): void => setActiveTab(activeKey)}
        >
            <TabPane
                tab={<span data-attr="insight-saved-tab">Saved</span>}
                key={InsightHistoryType.SAVED}
                data-attr="insight-saved-pane"
            >
                <Table
                    size="small"
                    columns={savedColumns}
                    loading={savedInsightsLoading}
                    rowKey={(insight) => insight.id}
                    pagination={{ pageSize: 100, hideOnSinglePage: true }}
                    dataSource={savedInsights}
                />
            </TabPane>
            <TabPane
                tab={<span data-attr="insight-history-tab">Recent</span>}
                key={InsightHistoryType.RECENT}
                data-attr="insight-history-pane"
            >
                <Table
                    size="small"
                    columns={recentColumns}
                    loading={insightsLoading}
                    rowKey={(insight) => insight.id}
                    pagination={{ pageSize: 100, hideOnSinglePage: true }}
                    dataSource={insights}
                />
            </TabPane>
            <SaveChartModal
                visible={visible}
                onCancel={(): void => {
                    setVisible(false)
                    setSelectedInsight(null)
                }}
                onSubmit={(text): void => {
                    if (selectedInsight) {
                        saveInsight(selectedInsight, text)
                    }
                    setVisible(false)
                    setSelectedInsight(null)
                }}
            />
        </Tabs>
    )
}

interface SaveChartModalProps {
    visible: boolean
    onCancel: () => void
    onSubmit: (input: string) => void
}

const SaveChartModal: React.FC<SaveChartModalProps> = (props) => {
    const { visible, onCancel, onSubmit } = props
    const [input, setInput] = useState<string>('')

    function _onCancel(): void {
        setInput('')
        onCancel()
    }

    return (
        <Modal
            visible={visible}
            footer={
                <Button type="primary" onClick={(): void => onSubmit(input)}>
                    Save
                </Button>
            }
            onCancel={_onCancel}
        >
            <div data-attr="invite-team-modal">
                <h2>Save Chart</h2>
                <label>Name of Chart</label>
                <Input
                    name="Name"
                    required
                    type="text"
                    placeholder="DAUs Last 14 days"
                    value={input}
                    onChange={(e): void => setInput(e.target.value)}
                />
            </div>
        </Modal>
    )
}
