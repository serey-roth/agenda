import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {initializeApp} from 'firebase/app'
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    updateProfile,
    updateEmail,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    AuthErrorCodes,
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAYzJBXrKKoBf9PuFI3P-wZSE7cGf6tzCI",
    authDomain: "todo-react-dcfdf.firebaseapp.com",
    projectId: "todo-react-dcfdf",
    storageBucket: "todo-react-dcfdf.appspot.com",
    messagingSenderId: "717482722874",
    appId: "1:717482722874:web:d0e33f3e4ba63026385703"
};
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const updateEmailAddress = (email) => {
   return updateEmail(auth.currentUser, email);
}

export const sendResetPasswordEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
}

export const handleError = (error) => {
    if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
        return `Wrong password. Try again.`;
    } else if (error.code === AuthErrorCodes.INVALID_EMAIL) {
        return `Wrong email address. Try again.`;
    } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
        return `Password should be at least 6 characters. Try again.`;
    } else if (error.code === AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE) {
        return `Account already exists. Try again.`;
    } else if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
        return `Email already in use. Try again.`;
    } else {
        return `Could not find your account. Try again.`;
    }
}

const initialState = {
    loggedIn: false, 
    user: null,
    status: 'idle',
    error: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {}, 
    extraReducers: builder => {
        const pendingCase = (state, action) => {
            state.status = 'loading';
        }
        const fulfilledCase = (state, action) => {
            if (auth.currentUser) {
                let { displayName, email, uid } = auth.currentUser;
                state.user = { displayName, email, uid };
            } else {
                state.user = null;
            }
            state.status = 'fulfilled';
            state.loggedIn = action.payload.loggedIn;
        }
        const rejectedCase = (state, action) => {
            state.status = 'failed';
            state.error = handleError(action.error);
        }

        builder
        .addCase(logIn.pending, pendingCase)
        .addCase(logIn.fulfilled, fulfilledCase)
        .addCase(logIn.rejected, rejectedCase)
        .addCase(googleSignIn.pending, pendingCase)
        .addCase(googleSignIn.fulfilled, fulfilledCase)
        .addCase(googleSignIn.rejected, rejectedCase)
        .addCase(signUp.pending, pendingCase)
        .addCase(signUp.fulfilled, fulfilledCase)
        .addCase(signUp.rejected, rejectedCase)
        .addCase(logOut.pending, pendingCase)
        .addCase(logOut.fulfilled, fulfilledCase)
        .addCase(setUserName.fulfilled, fulfilledCase)
    }
})

export const logIn = createAsyncThunk('auth/logIn', 
    async ({ email, password }) => {
        await signInWithEmailAndPassword(auth, email, password);
        return { loggedIn: true };
    }
)

export const signUp = createAsyncThunk('auth/signUp', 
    async ({ email, password }) => {
        await createUserWithEmailAndPassword(auth, email, password);
        return { loggedIn: true };
    }
)

export const setUserName = createAsyncThunk('auth/setUserName',
    async ({ userName }) => {
        await updateProfile(auth.currentUser, {
            displayName: userName,
        })
        return { loggedIn: true };
    }
)

export const googleSignIn = createAsyncThunk('auth/googleSignIn', 
    async () => {
        await signInWithPopup(auth, new GoogleAuthProvider());
        return { loggedIn: true };
    }
)

export const logOut = createAsyncThunk('auth/logOut',  
    async () => {
        await signOut(auth);
        return { loggedIn: false };
    }
);

export default authSlice.reducer