import { AnyAction, createAction } from '@reduxjs/toolkit';

import {
  deleteAllFromRichHistory,
  deleteQueryInRichHistory,
  updateCommentInRichHistory,
  updateStarredInRichHistory,
} from 'app/core/utils/richHistory';
import { ExploreId, ExploreItemState, ThunkResult } from 'app/types';
import { HistoryItem } from '@grafana/data';

import { richHistoryUpdatedAction } from './main';

//
// Actions and Payloads
//

export interface HistoryUpdatedPayload {
  exploreId: ExploreId;
  history: HistoryItem[];
}
export const historyUpdatedAction = createAction<HistoryUpdatedPayload>('explore/historyUpdated');

//
// Action creators
//

export const updateRichHistory = (ts: number, property: string, updatedProperty?: string): ThunkResult<void> => {
  return async (dispatch, getState) => {
    // Side-effect: Saving rich history in localstorage
    let nextRichHistory;
    if (property === 'starred') {
      nextRichHistory = await updateStarredInRichHistory(getState().explore.richHistory, ts);
    }
    if (property === 'comment') {
      nextRichHistory = await updateCommentInRichHistory(getState().explore.richHistory, ts, updatedProperty);
    }
    if (property === 'delete') {
      nextRichHistory = await deleteQueryInRichHistory(getState().explore.richHistory, ts);
    }
    dispatch(richHistoryUpdatedAction({ richHistory: nextRichHistory }));
  };
};

export const deleteRichHistory = (): ThunkResult<void> => {
  return async (dispatch) => {
    await deleteAllFromRichHistory();
    dispatch(richHistoryUpdatedAction({ richHistory: [] }));
  };
};

export const historyReducer = (state: ExploreItemState, action: AnyAction): ExploreItemState => {
  if (historyUpdatedAction.match(action)) {
    return {
      ...state,
      history: action.payload.history,
    };
  }
  return state;
};
