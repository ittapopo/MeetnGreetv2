import { 
    MeetingData, 
    GettingUnansweredMeetings,
    postMeeting,
    PostMeetingData
} from "./MeetingsData";
import { 
    Action, 
    ActionCreator, 
    Dispatch,
    Reducer,
    combineReducers,
    Store,
    createStore,
    applyMiddleware 
} from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';

interface MeetingsState {
    readonly loading: boolean;
    readonly unanswered: MeetingData[] | null;
    readonly postedResult?: MeetingData;
}

export interface AppState {
    readonly meetings: MeetingsState;
}

const initialMeetingState: MeetingsState = {
    loading: false,
    unanswered: null
};

interface GettingUnansweredMeetingsAction
  extends Action<'GettingUnansweredMeetings'> {}

export interface GotUnansweredMeetingsAction
  extends Action<'GotUnansweredMeetings'> {
      meetings: MeetingData[];
  }

export interface PostedMeetingAction extends
  Action<'PostedMeeting'> {
      result: MeetingData | undefined;
  }

type MeetingsAction =
  | GettingUnansweredMeetingsAction
  | GotUnansweredMeetingsAction
  | PostedMeetingAction;

export const getUnansweredMeetingsActionCreator: ActionCreator<
  ThunkAction<
    Promise<void>,
    MeetingData[],
    null,
    GotUnansweredMeetingsAction
    >
> = () => {
    return async (dispatch: Dispatch) => {
        const gettingUnansweredMeetingsAction:
        GettingUnansweredMeetingsAction = {
            type: 'GettingUnansweredMeetings'
        };
        dispatch(gettingUnansweredMeetingsAction);
        const meetings = await GettingUnansweredMeetings();
        const gotUnansweredMeetingAction: GotUnansweredMeetingsAction = {
            meetings,
            type: 'GotUnansweredMeetings'
        };
        dispatch(gotUnansweredMeetingAction);
    };
};

export const postMeetingActionCreator: ActionCreator<
  ThunkAction<
    Promise<void>,
    MeetingData,
    PostMeetingData,
    PostedMeetingAction
    >
> = (meeting: PostMeetingData) => {
    return async (dispatch: Dispatch) => {
        const result = await postMeeting(meeting);
        const postedMeetingAction: PostedMeetingAction = {
            type: 'PostedMeeting',
            result
        };
        dispatch(postedMeetingAction);
    };
};

export const clearPostedMeetingActionCreator: ActionCreator<
  PostedMeetingAction
> = () => {
    const postedMeetingAction: PostedMeetingAction = {
        type: 'PostedMeeting',
        result: undefined,
    };
    return postedMeetingAction;
};

const meetingsReducer: Reducer<MeetingsState, MeetingsAction> = (
    state = initialMeetingState,
    action
) => {
    switch (action.type) {
        case 'GettingUnansweredMeetings': {
            return {
                ...state,
                unanswered: null,
                loading: true
            };
        }
        case 'GotUnansweredMeetings': {
            return {
                ...state,
                unanswered: action.meetings,
                loading: false
            };
        }
        case 'PostedMeeting': {
            return {
                ...state,
                unanswered: action.result
                  ? (state.unanswered || []).concat(action.result)
                  : state.unanswered,
                postedResult: action.result
            };
        }
        default:
            neverReached(action);
    }
    return state;
};

const neverReached = (never: never) => {};

const rootReducer = combineReducers<AppState>({
    meetings: meetingsReducer
});

export function configureStore(): Store<AppState> {
    const store = createStore(
        rootReducer,
        undefined,
        applyMiddleware(thunk)
    );
    return store;
}