declare const TaskType = ['Assess', 'Compare', 'Mine', 'Querying', 'Reasoning', 'Recommend', 'Transformation','ReverseEngineering'] as const
type TaskType = typeof TaskType[number]

declare const MethodType = ['H' , 'ML' , 'Hybrid'] as const
type METHOD = typeof MethodType[number]

declare const VenueFieldType = ['Visualization', 'Human-computer Interaction', 'Databases', 'Artificial Intelligence', 'Computer Graphics', 'Data Mining', 'Computer Vision', 'Web & Information Retrieval', 'Natural Language Processing', 'Programming Languages'] as const
type VenueField = typeof VenueFieldType[number]

type SPACE = 'Data' | 'Graphics' | 'Text' | 'Program'
type ASSESS = {
    output?: 'Ranking' | 'Score',
    method?: METHOD
}
type COMPARE = {
    inputFeatureSpace?: SPACE
    method?: 'Distance' | 'Difference'
}
type FEATURE = {
    method?: 'Learning' | 'Engineering',
    inputFeatureSpace?: SPACE
}
type MINE = {
    subcategory?: 'Data' | 'Design',
    method?: 'VA' | 'Clustering' | 'Statistics'
}
type QUERYING = {
    queryType?: 'Example' | 'Keyword' | 'Structured',
    method?: 'Best-Match' | 'Exact-Match'
}
type REASONING = {
    subcategory?: 'VPL' | 'VQA' | "Summarization"
    method?: METHOD
}
type RECOMMEND = {
    subcategory?: 'data' | 'encoding' | 'hybrid'
    method?: 'H' | 'Hybrid' | 'Opt' | 'Prediction'
}
type REVERSEENGINEERING = {
    subcategory?: 'ChartRecognition' | 'Composing' | 'ElementClustering' | 'ElementDetection'
}
type TRANSFORMATION = {
    subcategory?: 'G2G'
}

type TaskObject = {
    task: TaskType
    label: ASSESS | COMPARE | MINE | QUERYING | REASONING | RECOMMEND | TRANSFORMATION | REVERSEENGINEERING;
}

type TASK = TaskObject[];

type ApplicationString = 'Analysis[Mining]' | 'Analysis[Retrieve]' | 'Enhance[Interaction]' | 'Enhance[QuestionAnswering]' | 'Enhance[Retarget]' | 'Enhance[Summary]' | 'Generation[Anchor]' | 'Generation[Context]' | 'Generation[Data]' | 'Generation[Design]' | 'Unknown[Unknown]'| 'nan';

interface PaperList {
    idx: string;
    title: string;
    journal: string;
    authors: string[];
    venue: string;
    venueField: VenueField;
    year: number;
    doi: number;
    visDataFormat: string | any;
    Application: ApplicationString[];
    tasks: TASK;
    feature?: FEATURE;
}


// type ANALYSIS = 'Mining' | 'Retrieve'
// type ENHANCE = 'Interaction' | 'QuestionAnswering' | 'Retarget' | 'Summary'
// type GENERATION = 'Anchor' | 'Context' | 'Data' | 'Design'
// type AppFilter = 'Analysis' | 'Enhance' | 'Generation' | 'Unknown'

interface OtherFilters {
    venueField: string[] | any[],
    visDataFormat: string[] | any[]
}

interface FilterTag {
    time: Array;
    tasks: TASK;
    taskLevel: Array;
    app: ApplicationString[];
    appLevel: Array;
    feature: FEATURE;
    otherFilters: OtherFilters;
}

interface FilterPayload {
    type: string;
    content: Array | TASK | FEATURE | OtherFilters;
}

type SubGoalCard = {
    subcategory: string;
    description: string;
    example: string;
}   
interface GoalCard {
    goal: string;
    image: string;
    description: string;
    subcategories: SubGoalCard[];
}

type SubMethodCard = {
    name: string;
    description: string;
    example: string;
}
type MethodCard = {
    name: string;
    childern: SubMethodCard[];
}
type TaskCard = {
    name: string;
    image: string;
    description: string;
    details: {
        description: string;
        image: string;
        categories: MethodCard[];
    }
}

type OverviewLabel = {
    name: string;
    image: string;
    type: 'tasks' | 'Application' | 'feature' | 'visDataFormat';
    idx: string;
}
// declare const TYPES = ['a', 'b', 'c'] as const; // TS3.4 syntax
// type yourType = typeof TYPES[number]; // 'a'|'b'|'c';