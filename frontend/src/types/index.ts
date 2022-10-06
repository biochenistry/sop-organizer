export interface Document {
  id: Number;
  name: String;
  location: String;
  editor?: Number;
  version_number: Number;
}

export interface Directories {
    id?: Number,
    name: String,
    description?: String,
    SOP?: Array<SOP>
}

export interface SOP {
  id?: Number;
  name: String;
  description?: String;
  documents?: Array<Document>;
}
