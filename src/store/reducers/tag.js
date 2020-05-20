import { GET_TAG } from '../types';

const initialState = {
  tag: {},
  notes: [],
  otherNotes: [],
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TAG:
      return {
        ...state,
        tag: payload.tag,
        notes: payload.notes,
        otherNotes: payload.otherNotes,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
