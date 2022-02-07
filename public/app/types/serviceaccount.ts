import { WithAccessControlMetadata } from '@grafana/data';
import { ApiKey, OrgRole } from '.';

export interface OrgServiceAccount {
  serviceAccountId: number;
  avatarUrl: string;
  email: string;
  login: string;
  name: string;
  displayName: string;
  orgId: number;
  role: OrgRole;
  tokens: number[];
}

export interface ServiceAccount {
  id: number;
  label: string;
  avatarUrl: string;
  login: string;
  email: string;
  name: string;
  displayName: string;
  orgId?: number;
}

export interface ServiceAccountDTO extends WithAccessControlMetadata {
  orgId: number;
  userId: number;
  email: string;
  name: string;
  avatarUrl?: string;
  login: string;
  role: string;
  lastSeenAt: string;
  lastSeenAtAge: string;
}

export interface ServiceAccountProfileState {
  serviceAccount: ServiceAccountDTO;
  tokens: ApiKey[];
}

export interface ServiceAccountsState {
  serviceAccounts: ServiceAccountDTO[];
  searchQuery: string;
  searchPage: number;
  isLoading: boolean;
}
