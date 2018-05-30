import * as React from 'react'
import Text from './Text'
import Switch from './Switch'
import SliderComponent from './SliderComponent'
import { steel, graphite } from '../styles/colors'

export type TimePickerProps = {
    seconds?: number
    handleSecondsChange: (seconds: number) => void
    containerStyle?: React.CSSProperties
}

const TimePicker: React.SFC<TimePickerProps> = ({
    seconds,
    handleSecondsChange,
    containerStyle
}) => {
    const minutes = Math.floor(seconds / 60) % 60
    let hours = Math.floor(seconds / 3600) % 3600

    const period = seconds - 12 * 3600 < 0 ? 'AM' : 'PM'
    if (period === 'PM') {
        hours = hours % 12
    }

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
                text={`${hours === 0 || hours === 12 ? 12 : hours % 12}:${
                    minutes.toString().length === 1 ? `0${minutes}` : minutes
                } ${period}`}
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
                    value={hours % 12 + 1}
                    onChange={newHour => {
                        const convertedHour = newHour - 1
                        const diffHours = convertedHour - hours

                        handleSecondsChange(seconds + diffHours * 3600)
                    }}
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
                    value={minutes}
                    onChange={newMinute => {
                        const diffMinutes = newMinute - minutes

                        handleSecondsChange(seconds + diffMinutes * 60)
                    }}
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
                        height: 22
                    },
                    textStyle: {
                        lineHeight: '17px'
                    }
                }}
                text={period}
                onClick={() => {
                    if (period === 'PM') {
                        const seconds = minutes * 60 + (hours % 12) * 3600
                        handleSecondsChange(seconds)
                    } else {
                        const seconds = minutes * 60 + (hours + 12) * 3600
                        handleSecondsChange(seconds)
                    }
                }}
            />
        </div>
    )
}

TimePicker.defaultProps = {
    seconds: (() => {
        const dt = new Date()
        return dt.getSeconds() + 60 * dt.getMinutes() + 60 * 60 * dt.getHours()
    })()
}

export default TimePicker
