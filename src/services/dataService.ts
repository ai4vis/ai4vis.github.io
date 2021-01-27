import axios from 'axios'

async function getPaperList() {
    const response = await axios.get("./allPaperLabels.json")
    console.log(JSON.parse(response.data))
    return JSON.parse(response.data)
}

export default {
    getPaperList
}