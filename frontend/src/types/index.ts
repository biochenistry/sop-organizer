export interface SOP {
    id?: Number,
    name: String,
    description?: String,
    documents?: Array<Document>
}

export interface Document {
    id: Number,
    name: String,
    location: String,
    editor?: Number
    version_number: Number
}
