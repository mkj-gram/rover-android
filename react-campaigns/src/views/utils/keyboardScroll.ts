/// <reference path="../../../typings/index.d.ts"/>
export default (
    targetElement: string,
    activateScroll: boolean,
    scrollContainerId: string
) => {
    const wizardModalBody = document.getElementById('wizardModalBody')
    const scrollContainer = document.getElementById(scrollContainerId)
    if (wizardModalBody && scrollContainer) {
        if (activateScroll) {
            wizardModalBody.style.marginBottom = `260px`
            const activeRowTop = document
                .getElementById(targetElement)
                .getBoundingClientRect().top

            const yValue =
                activeRowTop -
                wizardModalBody.clientHeight +
                50 +
                wizardModalBody.scrollTop

            scrollContainer.scrollBy(0, yValue)
        } else {
            wizardModalBody.style.marginBottom = `0px`
        }
    }
}
