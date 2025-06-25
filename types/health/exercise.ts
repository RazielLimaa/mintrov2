export interface Exercise{
    id: number
    name: string
    type: string
    is_distance: boolean
}

export interface ExerciseLog{
    id: number
    user: number
    exercise: number
    duration: number
    distance: number
    description: string
    datetime: Date
}


export interface ExerciseLogWrite{
    exercise: number
    duration: number
    distance?: number
    description: string
    datetime: string
}