const visDataFormat = ['Graphics', 'Program', 'Hybrid']
const application = ["AutoGen", "Enhance", "VisAnalysis"]

const method = ['H', 'ML']
const space = ['Data', 'Graphics', 'Text' , 'Program' ]

const assess = {
    'output': ['Ranking', 'Score'],
    'method': method
}

const compare = {
    'inputFeatureSpace': space,
    'method': ['Distance' , 'Difference']
}

const mine = {
    'subcategory': ['Data', 'Design'],
    'method': ['VA' , 'Clustering' , 'Statistics']
}

const querying = {
    'queryType': ['Example' , 'Keyword' , 'Structured'],
    'method': ['Best-Match' , 'Exact-Match']
}

const reasoning = {
    'subcategory': ['VPL' , 'VQA' , "Summarization"],
    'method': method
}

const recommend = {
    'subcategory': ['Data' , 'Encoding' , 'Hybrid'],
    'method': ['Opt' , 'Prediction']
}

const reverseEngineering = {
    'subcategory': ['ChartRecognition' , 'Composing' , 'ElementClustering' , 'ElementDetection']
}

const transformation = {
    'subcategory': ['G2G']
}

export const venueField = ['Visualization', 'Human-computer Interaction', 'Databases', 'Artificial Intelligence', 'Computer Graphics', 'Data Mining', 'Computer Vision', 'Web & Information Retrieval', 'Natural Language Processing', 'Programming Languages']

export const taskName = ['Assess', 'Compare', 'Mine', 'Querying', 'Reasoning', 'Recommend', 'Transformation', 'ReverseEngineering']

export const features = {
    'method': ['Learning', 'Engineering'],
    'inputFeatureSpace': space
}

export const tasks = [
    assess, 
    compare,
    mine,
    querying,
    reasoning,
    recommend,
    transformation,
    reverseEngineering,
]

export const taskDesc = [
    'Measures the absolute or relative quality of a visualization in terms of scores or rankings',
    'Estimates the similarity or other metrics between two visualizations',
    'Discover insights from visualization database',
    'Find the target visualization relevant with a user query within visualization collection',
    'Challenges machines to interpret visualizations to derive high-level information',
    'Automates the creation of visualizations by suggesting data and/or visual encodings',
    'Processes visualization graphics to output corresponding programs or another graphic',
    'Reverse engineering'
]

export const otherFilters = [
    venueField,
    visDataFormat,
]

export const otherFilterNames = [
    'venueField',
    'visDataFormat', 
]

export const applicationName = [
    'Analysis',
    'Enhance',
    'Generation',
    'Unknown'
]

export const applications = [
    ['Mining', 'Retrieve'],
    ['Interaction', 'QuestionAnswering', 'Retarget', 'Summary'],
    ['Anchor', 'Context', 'Data', 'Design'],
    ['Unknown']
]

export const appDesc = [
    'Concerns organizing and exploiting a visualization collection',
    'Processes and applies enhancement to an input visualization',
    'Outputs a visualization given different user inputs',
    'The paper primarily contributes a technique for solving a task (e.g. assessment, reverse engineering) without specifing the application'
]
