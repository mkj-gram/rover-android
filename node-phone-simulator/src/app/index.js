import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'

import uuidV4 from 'uuid/v4'

import { sendData } from './lib/roverAnalytics'

import { Block, Row, Screen, TitleBar, AndroidTitleBar, NavigationController } from '@rover/react-phone-components'

class App extends Component {

	constructor(props) {
		super(props)
		
		this.state = { platform: null, experienceSessionId: uuidV4() }

		this.getScreenBackground = this.getScreenBackground.bind(this)
		this.updatePlatform = this.updatePlatform.bind(this)
	}
	
	componentWillMount() {
		const {
			analyticsToken,
			analyticsURL,
			experience,
			showStatusBar
		} = this.props
		
		const { id, versionId } = experience
		
		const { experienceSessionId } = this.state
		
		if (typeof window !== 'undefined' && !showStatusBar) {
		    let deviceId = localStorage.getItem('rover-device-id')
		    if (deviceId === null) {
		        deviceId = uuidV4()
		        localStorage.setItem('rover-device-id', deviceId)
		    }
		    const name = 'experience launched'
		    sendData(
		        name,
		        {
		            'experience-id': id,
		            'version-id': versionId,
		            'experience-session-id': experienceSessionId
		        },
		        analyticsToken,
				analyticsURL
		    )
		}

	}

	componentDidMount() {
		typeof window !== 'undefined' && window.addEventListener('message', this.updatePlatform)
	}
	
	componentWillUnmount() {
		typeof window !== 'undefined' && window.removeEventListener('message', this.updatePlatform)
	}
	
	updatePlatform(e) {
		if (e.data.platform) {
			this.setState({ platform: e.data.platform })
		}
	}

	render() {
		const { experience, isMobile } = this.props
		return (
            experience.homeScreenId &&
			<div style={{ position: 'fixed', height: '100%', width: '100%', backgroundColor: '#EEEEEE' }}>
				<NavigationController
					homeScreen={experience.homeScreenId}
					renderRows={(screenId, handleClick, isCurrentScreen) => this.renderRows(screenId, handleClick, isCurrentScreen)}
					renderTitleBar={(screenId, handleClick) => this.renderTitleBar(screenId, handleClick)}
					screenBackground={screenId => this.getScreenBackground(screenId)}
					enterTransition={{ animationName: 'ltr', animationDuration: '400ms', transitionTimingFunction: 'ease-in-out' }}
					exitTransition={{ animationName: 'rtl', animationDuration: '400ms', transitionTimingFunction: 'ease-in-out' }}
                    showMobileView={isMobile}
				/>
			</div>
		)
	}
	getScreenBackground(screenId) {
		const screen = this.props.experience.screens[screenId]
		return {
			backgroundColor: screen.backgroundColor,
			backgroundImage: screen.backgroundImage,
			backgroundContentMode: screen.backgroundContentMode,
			backgroundScale: screen.backgroundScale
		}  
	}
	
	renderRows(screenId, handleClick, isCurrentScreen) {
		const { analyticsToken, analyticsURL, experience, showStatusBar } = this.props
		const { experienceSessionId } = this.state
		const screen = experience.screens[screenId]
		if (!screen.rows) {
		    return
		}

		
		if (typeof window !== 'undefined' && isCurrentScreen && !showStatusBar) {
		    const name = 'experience screen-viewed'
		    sendData(
		        name,
		        {
		            'experience-id': experience.id,
		            'experience-session-id': experienceSessionId,
		            'version-id': experience.versionId,
		            'screen-id': screenId
		        },
		        analyticsToken,
				analyticsURL
		    )
		}

		const rowValues = Object.keys(screen.rows).map(key => screen.rows[key])

		return rowValues.map(row => {
			return (
				<Row
					autoHeight={row.autoHeight}
					key={row.id} 
					height={row.height} 
					backgroundColor={row.backgroundColor}
					backgroundImage={row.backgroundImage}
					backgroundContentMode={row.backgroundContentMode}
					backgroundScale={row.backgroundScale}
					renderBlocks={this.renderBlocks(row, handleClick)}
				/>
			)
		}).filter(row => row !== null)
	}
	
	renderBlocks(row, handleClick) {
		const { analyticsToken, analyticsURL, isAndroid, experience, showStatusBar } = this.props
		const { experienceSessionId } = this.state
		
		return () => {
			if (!row.blocks) {
				return
			}
			
			const platform = isAndroid  ? 'Android' : 'iOS'
			
			const handleBlockClick = ({ action, id, screenId, type }) => {
				handleClick(action)
				if (action && !showStatusBar) {
					const { type, url } = action
					const name = 'experience block-clicked'
					const attributes = {
						'experience-id': experience.id,
						'version-id': experience.versionId,
						'experience-session-id': experienceSessionId,
						'screen-id': screenId,
						'block-id': id,
						'block-action': {
							type,
							url,
							'screen-id': action.screenId
						}
					}
					sendData(name, attributes, analyticsToken, analyticsURL)
				}
			}
			
			const blockValues = Object.keys(row.blocks).map(key => row.blocks[key])
			
			return blockValues.map((block, index) => {
				return (
					<Block
                        key={block.id}
                        type={block.type}
                        width={block.width}
                        height={block.height}
                        opacity={block.opacity}
                        position={block.position}
                        horizontalAlign={block.horizontalAlign}
                        verticalAlign={block.verticalAlign}
                        top={block.top}
                        right={block.right}
                        bottom={block.bottom}
                        left={block.left}
                        center={block.center}
                        middle={block.middle}
                        insets={block.insets}
                        backgroundColor={block.backgroundColor}
                        backgroundImage={block.backgroundImage}
                        backgroundContentMode={block.backgroundContentMode}
                        backgroundScale={block.backgroundScale}
                        borderColor={block.borderColor}
                        borderWidth={block.borderWidth}
                        borderRadius={block.borderRadius}
                        autoHeight={block.autoHeight}
                        color={block.color}
                        fontSize={block.fontSize}
                        fontWeight={block.fontWeight}
                        textAlign={block.textAlign}
                        text={block.text}
                        image={block.image}
                        url={block.url}
                        order={Object.keys(row.blocks).length - index + 1}
                        onClick={() => handleBlockClick(block)}
                        phonePlatform={platform}
                    />
				)
			}).filter(block => block !== null)
		}
	}

	renderTitleBar(screenId, handleClick) {
			const { isAndroid, isMobile, showStatusBar, showCloseButton } = this.props
			
			const getPlatform = () => {
				if (this.state.platform) {
					return this.state.platform
				}
				
				if (isAndroid) {
					return 'Android'
				}
				
				return 'iOS'
			}
	        
	        const getStatusBarColor = () => {
	            const { useDefaultTitleBarStyle } = this.props.experience.screens[screenId]
	            
	            if (useDefaultTitleBarStyle) {
	                return {
	                    useDefaultTitleBarStyle: false,
	                    titleBarBackgroundColor: {
	                        red: 50,
	                        green: 50,
	                        blue: 50,
	                        alpha: 1
	                    },
	                    titleBarButtonColor: {
	                        red: 255,
	                        green: 255,
	                        blue: 255,
	                        alpha: 1
	                    },
	                    titleBarTextColor: {
	                        red: 255,
	                        green: 255,
	                        blue: 255,
	                        alpha: 1
	                    },
	                    statusBarColor: {
	                        red: 24,
	                        green: 24,
	                        blue: 24,
	                        alpha: 1
	                    }
	                }
	            }
	            return
	        }
	        
	        if (getPlatform() === 'Android') {
	            return  (
	                <AndroidTitleBar
	                	{...this.props.experience.screens[screenId]}
	                    onClick={handleClick}
						showStatusBar={showStatusBar}
						showCloseButton={showCloseButton}
	                    {...getStatusBarColor()}
	                />
	            )
	        }
			
	        return (
	            <TitleBar
	                {...this.props.experience.screens[screenId]}
	                onClick={handleClick}
					showStatusBar={showStatusBar}
					showCloseButton={showCloseButton}
	                {...getStatusBarColor()}
	            />
	        )

	    }
}

App.propTypes = {
	experience: PropTypes.shape({
		analyticsToken: PropTypes.string,
		hasUnpublishedChanges: PropTypes.bool,
		homeScreenId: PropTypes.string,
		id: PropTypes.string,
		isArchived: PropTypes.bool,
		isPublished: PropTypes.bool,
		name: PropTypes.string,
		screens: PropTypes.object,
		shortUrl: PropTypes.string
	}),
	isAndroid: PropTypes.bool.isRequired,
	isMobile: PropTypes.bool.isRequired,
	showStatusBar: PropTypes.bool.isRequired,
	showCloseButton: PropTypes.bool.isRequired,
}

export default App

if (typeof window !== 'undefined') {
	render(
		<App {...window.PROPS}/>,
		document.getElementById('root')
	)
}