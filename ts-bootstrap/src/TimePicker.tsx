import * as React from 'react'
import Text from './Text'
import Switch from './Switch'
import SliderComponent from './SliderComponent'
import { steel, graphite } from '../styles/colors'

export type TimePickerProps = {
    hour: number
    minute: number
    period: string
    handleHourChange: (hour: number) => void
    handleMinuteChange: (minute: number) => void
    handlePeriodChange: (period: string) => void
    containerStyle?: React.CSSProperties
}

const TimePicker: React.SFC<TimePickerProps> = ({
    hour,
    minute,
    period,
    handleHourChange,
    handleMinuteChange,
    containerStyle,
    handlePeriodChange
}) => {
    const formatMinute = () =>
        minute.toString().length === 1 ? `0${minute}` : minute

    return (
        <div
            style={{
                width: 352,
                height: 272,
                ...containerStyle
            }}
        >
            <Text
                size="x-large"
                text={`${hour}:${formatMinute()} ${period}`}
                textStyle={{ paddingBottom: 24 }}
            />
            <div
                style={{
                    paddingBottom: 24,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Text size="medium" text="Hour" />
                <SliderComponent
                    min={1}
                    max={12}
                    value={hour % 12 + 1}
                    onChange={hour => 
                        handleHourChange(((hour + 10) % 12) + 1)
                    }
                    containerStyle={{
                        width: '100%'
                    }}
                />
            </div>
            <div
                style={{
                    paddingBottom: 24,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Text size="medium" text="Minute" />
                <SliderComponent
                    min={0}
                    max={59}
                    value={minute}
                    onChange={handleMinuteChange}
                    containerStyle={{
                        width: '100%'
                    }}
                />
            </div>

            <Switch
                on={period === 'AM'}
                style={{
                    outerStyle: {
                        backgroundColor: period === 'AM' ? steel : graphite,
                        height: 23
                    }
                }}
                text={period}
                onClick={() => handlePeriodChange(period)}
            />
        </div>
    )
}

export default TimePicker
