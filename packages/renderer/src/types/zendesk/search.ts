export type ZendeskResult = {
  allow_attachments: boolean;
  allow_channelback: boolean;
  assignee_id: number;
  brand_id: number;
  collaborator_ids: number[];
  created_at: string;
  custom_fields: Array<{
    id: number;
    value: string | number | boolean | null;
  }>;
  custom_status_id?: number;
  description: string;
  due_at: string | null;
  email_cc_ids: number[];
  encoded_id: string;
  external_id: string | null;
  fields: Array<{
    id: number;
    value: string | number | boolean | null;
  }>;
  follower_ids: number[];
  followup_ids: number[];
  forum_topic_id: number | null;
  from_messaging_channel: boolean;
  generated_timestamp: number;
  group_id: number;
  has_incidents: boolean;
  id: number;
  is_public: boolean;
  organization_id: number | null;
  priority: string | null;
  problem_id: number | null;
  raw_subject: string;
  recipient: string;
  requester_id: number;
  satisfaction_rating?: {
    score: "unoffered" | "offered" | "good" | "bad" | string;
  };
  sharing_agreement_ids: number[];
  status: string;
  subject: string;
  submitter_id: number;
  tags: string[];
  ticket_form_id: number | null;
  type: string | null;
  updated_at: string;
  url: string;
  via: {
    channel: string;
    source: {
      from?: {
        address?: string;
        name?: string;
      };
      to?: {
        address?: string;
        name?: string;
      };
      rel?: string | null;
    };
  };
};

export type ZendeskSearchResults = {
  count: number;
  facets: null;
  next_page: string | null;
  previous_page: string | null;
  results: ZendeskResult[];
};

export type ApiInfo = {
  remaining: number;
  rateLimit: number;
  retryAfter: number;
};

export type ZendeskSearchType = {
  data?: ZendeskSearchResults;
  api?: ApiInfo;
  error?: string;
};
