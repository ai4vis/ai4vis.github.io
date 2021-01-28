import { Popover } from "ant-design-vue"

function GenerateTask(obj: any) {

}

export const formatter = (name: string) => {
    // console.log(name)
    if (name.length === 0)
        return name
    if (name === 'G2G') {
        return 'Image-to-Image Transformation'
    } else if (name === 'H') {
        return 'Rule-based'
    } else if (name === 'ML') {
        return 'Machine Learning'
    } else if (name === 'VA') {
        return 'Visual Analysis'
    } else if (name === 'VPL') {
        return 'Visual Perceptual Learning'
    } else if (name === 'VQA') {
        return 'Visual Question Answering'
    } else if (name === 'Summarization') {
        return 'Chart Summarization'
    } else if (name === 'Opt') {
        return 'Optimization'
    } else if (name === 'Unknown') {
        return 'Unspecified'
    } else if (name === 'venueField') {
        return 'Filter by Publish Area'
    } else if (name === 'visDataFormat') {
        return 'Visualization Data Format'
    }
    name = name[0].toUpperCase() + name.substring(1)

    if (name.search('Best-Match') > -1 || name.search('Exact-Match') > -1) {
        let output = name.match('Best-Match') || name.match('Exact-Match')
        return output? output[0]:''
    }
    let regex = /[A-Z]+[a-z]*/g
    let output = name.match(regex)
    if (output) {
        return output.join(' ')
    }   
    else
        return ''
}