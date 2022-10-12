export interface Document {
  id: Number;
  name: String;
  location: String;
  editor?: Number;
  version_number: Number;
}

export interface Directory {
    id?: Number,
    name: String,
    description?: String,
}

export interface SOP {
  id?: Number;
  name: String;
  description?: String;
  documents?: Array<Document>;
}
