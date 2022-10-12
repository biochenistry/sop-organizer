export interface Document {
  id: Number;
  name: String;
  location: String;
  editor?: Number;
  version_number: Number;
  marked_for_deletion_by_user_id?: Number;
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

export interface User {
  id: Number;
  name: String;
  privileges: Boolean;
  password?: String;
}
