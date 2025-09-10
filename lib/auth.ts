import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole } from './types';

// Auth providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// Custom claims interface
export interface CustomClaims {
  role: UserRole;
  orgId: string;
  approvalLimit?: number;
}

// Sign in with email and password
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

// Sign in with Google
export async function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, googleProvider);
}

// Sign in with Microsoft
export async function signInWithMicrosoft(): Promise<UserCredential> {
  return signInWithPopup(auth, microsoftProvider);
}

// Sign out
export async function signOutUser(): Promise<void> {
  return signOut(auth);
}

// Get current user with custom claims
export async function getCurrentUser(): Promise<User | null> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  try {
    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      // Try to create user document if it doesn't exist
      console.log('User document not found, attempting to create...');
      try {
        await createUserDocument(firebaseUser);
        // Retry getting the user document
        const retryDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (retryDoc.exists()) {
          const userData = retryDoc.data();
          return {
            id: firebaseUser.uid,
            ...userData,
            createdAt: userData.createdAt?.toDate() || new Date(),
            updatedAt: userData.updatedAt?.toDate() || new Date(),
          } as User;
        }
      } catch (createError) {
        console.error('Error creating user document:', createError);
        // Return a minimal user object to prevent infinite loops
        return {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Unknown User',
          email: firebaseUser.email || '',
          role: 'requester',
          orgId: '',
          approvalLimit: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as User;
      }
      // If we get here, return a minimal user object instead of null
      return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Unknown User',
        email: firebaseUser.email || '',
        role: 'requester',
        orgId: '',
        approvalLimit: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
    }

    const userData = userDoc.data();
    return {
      id: firebaseUser.uid,
      ...userData,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate() || new Date(),
    } as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    // Return a minimal user object instead of null to prevent auth loops
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Unknown User',
      email: firebaseUser.email || '',
      role: 'requester',
      orgId: '',
      approvalLimit: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  }
}

// Get user custom claims from Firebase Auth
export async function getCustomClaims(): Promise<CustomClaims | null> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  try {
    const tokenResult = await firebaseUser.getIdTokenResult();
    const claims = tokenResult.claims as unknown as CustomClaims;
    return claims;
  } catch (error) {
    console.error('Error getting custom claims:', error);
    return null;
  }
}

// Check if user has required role
export function hasRole(user: User | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

// Check if user is admin
export function isAdmin(user: User | null): boolean {
  return hasRole(user, ['admin']);
}

// Check if user is approver
export function isApprover(user: User | null): boolean {
  return hasRole(user, ['approver', 'admin']);
}

// Check if user is cardholder
export function isCardholder(user: User | null): boolean {
  return hasRole(user, ['cardholder', 'admin']);
}

// Check if user is auditor
export function isAuditor(user: User | null): boolean {
  return hasRole(user, ['auditor', 'admin']);
}

// Check if user is requester
export function isRequester(user: User | null): boolean {
  return hasRole(user, [
    'requester',
    'approver',
    'cardholder',
    'auditor',
    'admin',
  ]);
}

// Check if user belongs to organization
export function belongsToOrg(user: User | null, orgId: string): boolean {
  if (!user) return false;
  return user.orgId === orgId;
}

// Check if user can approve amount
export function canApproveAmount(user: User | null, amount: number): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (isApprover(user) && user.approvalLimit && amount <= user.approvalLimit)
    return true;
  return false;
}

// Create user document in Firestore (called after successful auth)
export async function createUserDocument(
  firebaseUser: FirebaseUser,
  additionalData: Partial<User> = {}
): Promise<void> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email } = firebaseUser;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        name: displayName || 'Unknown User',
        email: email || '',
        role: 'requester', // Default role
        orgId: '', // Must be set by admin
        approvalLimit: 0,
        createdAt,
        updatedAt: createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }
}

// Auth state change listener
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, async firebaseUser => {
    if (firebaseUser) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}

// Force refresh of custom claims
export async function refreshCustomClaims(): Promise<void> {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    await firebaseUser.getIdToken(true); // Force refresh
  }
}

// Check if user needs role assignment
export async function needsRoleAssignment(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // Check if user has empty orgId or default role
  return !user.orgId || user.role === 'requester';
}

// Utility function to get user display name
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Unknown User';
  return user.name || user.email || 'Unknown User';
}

// Utility function to get user initials
export function getUserInitials(user: User | null): string {
  if (!user) return 'U';
  const name = user.name || user.email || 'Unknown User';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
}

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  requester: 1,
  approver: 2,
  cardholder: 2,
  auditor: 3,
  admin: 4,
};

// Check if user has higher or equal role level
export function hasRoleLevel(
  user: User | null,
  requiredRole: UserRole
): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
}
