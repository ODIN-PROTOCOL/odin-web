/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  telemetryDataForCharts,
  formatedTelemetryDataForCharts,
} from '@/helpers/Types'

export enum DoughnutChartType {
  SIMPLE,
  EXTENDED,
}
import { big as bigMath } from './bigMath'

export const getChartOptions = (datasetUnit: string, labels: string[]) => {
  return {
    responsive: true,
    scales: {
      yAxis: {
        display: false,
        ticks: {
          count: 6,
        },
      },
      xAxis: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
          callback: (value: any) => {
            return _getShortLabelDate(labels[value])
          },
        },
      },
    },
    interaction: {
      intersect: false,
      axis: 'x',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        yAlign: 'chartjs-tooltip_bottom',
        padding: 0,
        enabled: false,
        external: createExternalTooltip(datasetUnit),
      },
    },
  }
}

export const createExternalTooltip = (
  datasetUnit: string,
  additionalInfo: any = null,
) => {
  return (ctx: any): void => {
    const tooltipModel = ctx.tooltip
    let tooltipEl = document.getElementById('chartjs-tooltip')
    let tooltipArrow = tooltipEl?.querySelector(
      '.chartjs-tooltip__arrow',
    ) as HTMLElement

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = _createTooltip()
      tooltipArrow = _createTooltipArrow(tooltipEl)
    }

    _setTooltipArrowPosition(tooltipEl, tooltipModel)

    // Set Text
    if (tooltipModel.body) {
      let innerHtml = ''
      if (additionalInfo) {
        innerHtml += _setTooltipDataFromAdditionalInfo(
          tooltipModel,
          additionalInfo,
        )
      } else {
        innerHtml += _setTooltipTitles(tooltipModel)
        innerHtml += _setTooltipBody(tooltipModel, datasetUnit)
      }

      const divRoot = tooltipEl.querySelector('div')
      if (divRoot) {
        divRoot.innerHTML = innerHtml
      }
    }

    _toggleTooltipDisplay(tooltipEl, tooltipModel)

    _setTooltipAndArrowOnChart(ctx.chart, tooltipModel, tooltipEl, tooltipArrow)
  }
}

const _createTooltip = (): HTMLElement => {
  const tooltipEl = document.createElement('div')
  tooltipEl.id = 'chartjs-tooltip'
  tooltipEl.innerHTML = '<div></div>'
  document.body.appendChild(tooltipEl)

  return tooltipEl
}

const _createTooltipArrow = (tooltip: HTMLElement): HTMLElement => {
  const tooltipArrow = document.createElement('span')
  tooltipArrow.className = 'chartjs-tooltip__arrow'
  tooltip.appendChild(tooltipArrow)

  return tooltipArrow
}

const _toggleTooltipDisplay = (tooltip: HTMLElement, tooltipModel: any) => {
  tooltip.style.opacity = tooltipModel.opacity === 0 ? '0' : '1'
}

const _setTooltipArrowPosition = (tooltip: HTMLElement, tooltipModel: any) => {
  tooltip.classList.remove('above', 'below', 'no-transform')

  if (tooltipModel.yAlign) {
    tooltip.classList.add(tooltipModel.yAlign)
  } else {
    tooltip.classList.add('no-transform')
  }
}

const _setTooltipAndArrowOnChart = (
  chart: any,
  tooltipModel: any,
  tooltip: HTMLElement,
  tooltipArrow: HTMLElement,
) => {
  const position = chart.canvas.getBoundingClientRect()

  tooltip.style.left =
    position.left +
    window.pageXOffset +
    tooltipModel.x -
    (tooltip.offsetWidth - tooltipModel.width) / 2 +
    'px'
  tooltip.style.top =
    position.top +
    window.pageYOffset +
    tooltipModel.caretY -
    tooltip.offsetHeight -
    18 +
    'px'

  tooltipArrow.style.left =
    tooltipModel.caretX + position.left - tooltip.offsetLeft + 'px'
}

const _setTooltipTitles = (tooltipModel: any) => {
  const titleLines = tooltipModel.title
  let innerHtml = ''

  titleLines.forEach((title: any) => {
    innerHtml += '<span>' + _getLabelDate(title) + '</span>'
  })

  return innerHtml
}

const _setTooltipBody = (tooltipModel: any, unit: string) => {
  const bodyLines = tooltipModel.body.map((item: any) => item.lines)
  let innerHtml = ''

  bodyLines.forEach((body: any) => {
    const delimiterIndex = body[0].lastIndexOf(':')
    const lineTitle = body[0].substring(0, delimiterIndex + 1)
    const lineValue = body[0].substring(delimiterIndex + 1, body[0].length)
    innerHtml +=
      '<div class="tooltip-row"><span class="chartjs-tooltip__row-title">' +
      lineTitle +
      '</span><span>' +
      '&nbsp' +
      lineValue +
      '&nbsp' +
      unit +
      '</span></div>'
  })

  return innerHtml
}

const _setTooltipDataFromAdditionalInfo = (
  tooltipModel: any,
  additionalInfo: any,
) => {
  const dataIndex = tooltipModel.dataPoints[0].dataIndex
  const data = additionalInfo[dataIndex]
  let innerHtml = ''

  let firstEnter = true
  for (const [key, value] of Object.entries(data)) {
    if (firstEnter) {
      innerHtml += '<span class="chartjs-tooltip__title">' + value + '</span>'
      firstEnter = false
    } else {
      innerHtml +=
        '<div class="tooltip-row"><span class="chartjs-tooltip__row-title">' +
        key +
        ':' +
        '</span><span>' +
        '&nbsp' +
        value +
        '</span></div>'
    }
  }
  return innerHtml
}

const _getLabelDate = (date: string) => {
  const dateObj = new Date(date)
  const month = dateObj.toLocaleString('en', { month: 'long' })
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()

  return `${month} ${day}, ${year}`
}

const _getShortLabelDate = (date: string) => {
  const dateObj = new Date(date)
  const month = dateObj.toLocaleString('en', { month: 'short' })
  const day = dateObj.getDate()

  return `${month}. ${day}`
}

export const formatDataForCharts = (
  data: telemetryDataForCharts[],
): formatedTelemetryDataForCharts => {
  const values: number[] = []
  const labels: string[] = []

  data.forEach(({ date, ...rest }: telemetryDataForCharts) => {
    labels.push(date)
    if (rest.value) {
      values.push(Number(rest.value))
    } else {
      values.push(Number(rest.volume))
    }
  })

  return { data: values, labels }
}
