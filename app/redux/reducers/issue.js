import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { ecode: 0, collection: [], itemData: {}, options: {}, indexLoading: false, visitedCollection: [], visitedIndex: -1, optionsLoading: false, searchLoading: false, searcherLoading: false, loading: false, itemLoading: false, fileLoading: false, selectedItem: {}, commentsCollection: [], commentsIndexLoading: false, commentsLoading: false, commentsItemLoading: false, commentsLoaded: false, historyCollection: [], historyIndexLoading: false, historyLoaded: false, worklogCollection: [], worklogIndexLoading: false, worklogLoading: false, worklogItemLoading: false, worklogLoaded: false };

export default function issue(state = initialState, action) {
  switch (action.type) {
    case t.ISSUE_INDEX:
      return { ...state, indexLoading: true, collection: [] };

    case t.ISSUE_INDEX_SUCCESS:
      _.assign(state.options, action.result.options || {});
      return { ...state, indexLoading: false, ecode: action.result.ecode, collection: action.result.data };

    case t.ISSUE_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.ISSUE_OPTIONS:
      return { ...state, optionsLoading: true };

    case t.ISSUE_OPTIONS_SUCCESS:
      _.assign(state.options, action.result.data || {});
      return { ...state, optionsLoading: false, ecode: action.result.ecode };

    case t.ISSUE_OPTIONS_FAIL:
      return { ...state, optionsLoading: false, error: action.error };

    case t.ISSUE_CREATE:
      return { ...state, loading: true };

    case t.ISSUE_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection.unshift(action.result.data);
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ISSUE_EDIT:
      return { ...state, loading: true };

    case t.ISSUE_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
        if (!_.isEmpty(state.itemData) && action.result.data.id === state.itemData.id) {
          state.itemData = action.result.data;
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.ISSUE_EDIT_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.ISSUE_SHOW:
      return { ...state, itemLoading: true, itemData: { id: action.id }, commentsLoaded: false };

    case t.ISSUE_SHOW_SUCCESS:
      return { ...state, itemLoading: false, ecode: action.result.ecode, itemData: action.result.data };

    case t.ISSUE_SHOW_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.ISSUE_DELETE_NOTIFY:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, itemLoading: false, selectedItem: { id: el.id, name: el.name } };

    case t.ISSUE_DELETE:
      return { ...state, itemLoading: true };

    case t.ISSUE_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.ISSUE_SEARCHER_ADD:
      return { ...state, searcherLoading: true };

    case t.ISSUE_SEARCHER_ADD_SUCCESS:
      if ( action.result.ecode === 0 ) {
        if (!state.options.searchers) {
          state.options.searchers = [];
        }
        state.options.searchers.push(action.result.data);
      }
      return { ...state, searcherLoading: false, ecode: action.result.ecode };

    case t.ISSUE_SEARCHER_ADD_FAIL:
      return { ...state, searcherLoading: false, error: action.error };

    case t.ISSUE_SEARCHER_DELETE:
      return { ...state, searcherLoading: true };

    case t.ISSUE_SEARCHER_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.options.searchers = _.reject(state.options.searchers, { id: action.id });
      }
      return { ...state, searcherLoading: false, ecode: action.result.ecode };

    case t.ISSUE_SEARCHER_DELETE_FAIL:
      return { ...state, searcherLoading: false, error: action.error };

    case t.ISSUE_FILE_DELETE:
      return { ...state, fileLoading: true };

    case t.ISSUE_FILE_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.itemData[action.field_key] = _.reject(state.itemData[action.field_key] || [], { id: action.id });
      }
      return { ...state, fileLoading: false, ecode: action.result.ecode };

    case t.ISSUE_FILE_DELETE_FAIL:
      return { ...state, fileLoading: false, error: action.error };

    case t.ISSUE_FILE_ADD:
      if (!state.itemData[action.field_key]) {
        state.itemData[action.field_key] = [];
      }
      state.itemData[action.field_key].push(action.file);
      return { ...state, itemData: state.itemData };

    case t.ISSUE_SET_ASSIGNEE:
      return { ...state, itemLoading: true };

    case t.ISSUE_SET_ASSIGNEE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
        if (!_.isEmpty(state.itemData) && action.result.data.id === state.itemData.id) {
          state.itemData = action.result.data;
        }
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_SET_ASSIGNEE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.ISSUE_COMMENTS_INDEX:
      return { ...state, commentsIndexLoading: true, commentsCollection: [] };

    case t.ISSUE_COMMENTS_INDEX_SUCCESS:
      _.assign(state.options, action.result.options || {});
      return { ...state, commentsIndexLoading: false, commentsLoaded: true, ecode: action.result.ecode, commentsCollection: action.result.data };

    case t.ISSUE_COMMENTS_INDEX_FAIL:
      return { ...state, commentsIndexLoading: false, error: action.error };

    case t.ISSUE_COMMENTS_ADD:
      return { ...state, commentsLoading: true };

    case t.ISSUE_COMMENTS_ADD_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.commentsCollection.unshift(action.result.data);
      }
      return { ...state, commentsLoading: false, ecode: action.result.ecode };

    case t.ISSUE_COMMENTS_ADD_FAIL:
      return { ...state, commentsLoading: false, error: action.error };

    case t.ISSUE_COMMENTS_EDIT:
      return { ...state, commentsItemLoading: true };

    case t.ISSUE_COMMENTS_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.commentsCollection, { id: action.result.data.id });
        state.commentsCollection[ind] = action.result.data;
      }
      return { ...state, commentsItemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_COMMENTS_EDIT_FAIL:
      return { ...state, commentsItemLoading: false, error: action.error };

    case t.ISSUE_COMMENTS_DELETE:
      return { ...state, commentsItemLoading: true };

    case t.ISSUE_COMMENTS_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.commentsCollection = _.reject(state.commentsCollection, { id: action.id });
      }
      return { ...state, commentsCollection: state.commentsCollection, commentsItemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_COMMENTS_DELETE_FAIL:
      return { ...state, commentsItemLoading: false, error: action.error };

    case t.ISSUE_HISTORY_INDEX:
      return { ...state, historyIndexLoading: true, historyCollection: [] };

    case t.ISSUE_HISTORY_INDEX_SUCCESS:
      _.assign(state.options, action.result.options || {});
      return { ...state, historyIndexLoading: false, historyLoaded: true, ecode: action.result.ecode, historyCollection: action.result.data };

    case t.ISSUE_HISTORY_INDEX_FAIL:
      return { ...state, historyIndexLoading: false, error: action.error };

    case t.ISSUE_WORKLOG_INDEX:
      return { ...state, worklogIndexLoading: true, worklogCollection: [] };

    case t.ISSUE_WORKLOG_INDEX_SUCCESS:
      _.assign(state.options, action.result.options || {});
      return { ...state, worklogIndexLoading: false, worklogLoaded: true, ecode: action.result.ecode, worklogCollection: action.result.data };

    case t.ISSUE_WORKLOG_INDEX_FAIL:
      return { ...state, worklogIndexLoading: false, error: action.error };

    case t.ISSUE_WORKLOG_ADD:
      return { ...state, worklogLoading: true };

    case t.ISSUE_WORKLOG_ADD_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.worklogCollection.unshift(action.result.data);
      }
      return { ...state, worklogLoading: false, ecode: action.result.ecode };

    case t.ISSUE_WORKLOG_ADD_FAIL:
      return { ...state, worklogLoading: false, error: action.error };

    case t.ISSUE_WORKLOG_EDIT:
      return { ...state, worklogItemLoading: true };

    case t.ISSUE_WORKLOG_EDIT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.worklogCollection, { id: action.result.data.id });
        state.worklogCollection[ind] = action.result.data;
      }
      return { ...state, worklogItemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_WORKLOG_EDIT_FAIL:
      return { ...state, worklogItemLoading: false, error: action.error };

    case t.ISSUE_WORKLOG_DELETE:
      return { ...state, worklogItemLoading: true };

    case t.ISSUE_WORKLOG_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.worklogCollection = _.reject(state.worklogCollection, { id: action.id });
      }
      return { ...state, worklogCollection: state.worklogCollection, worklogItemLoading: false, ecode: action.result.ecode };

    case t.ISSUE_WORKLOG_DELETE_FAIL:
      return { ...state, worklogItemLoading: false, error: action.error };

    case t.ISSUE_RECORD:
      const forwardIndex = _.add(state.visitedIndex, 1);
      if (state.visitedCollection[forwardIndex]) {
        state.visitedCollection.splice(forwardIndex);
      }
      if (state.visitedCollection.length <= 0 || (state.visitedCollection[state.visitedIndex] && state.visitedCollection[state.visitedIndex] !== state.itemData.id)) {
        state.visitedCollection.push(state.itemData.id);
      }
      return { ...state, visitedCollection: state.visitedCollection, visitedIndex: state.visitedCollection.length - 1 };

    case t.ISSUE_FORWARD:
      return { ...state, visitedIndex: _.add(state.visitedIndex, action.offset || 0) };

    case t.ISSUE_CLEAN_RECORD:
      return { ...state, visitedIndex: -1, visitedCollection: [] };

    default:
      return state;
  }
}
