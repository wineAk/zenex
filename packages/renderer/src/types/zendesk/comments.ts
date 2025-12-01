export type ZendeskCommentType = {
  data?: ZendeskCommentResults;
  api?: ApiInfo;
  error?: string;
};

export type ApiInfo = {
  remaining: number;
  rateLimit: number;
  retryAfter: number;
};

export type ZendeskCommentResults = {
  count: number;
  next_page: string | null;
  previous_page: string | null;
  comments: ZendeskComment[];
};

export type ZendeskComment = {
  id: number;
  type: "Comment";
  author_id: number;
  body: string;
  html_body: string;
  plain_body: string;
  public: boolean;
  attachments: ZendeskAttachment[];
  audit_id: number;
  via: {
    channel: string;
    source: {
      from: {
        address: string;
        name: string;
        original_recipients?: string[];
      };
      to: {
        name: string;
        address: string;
      };
      rel: string | null;
    };
  };
  created_at: string; // ISO8601
  metadata: {
    system: {
      message_id: string;
      email_id: string;
      ip_address: string;
      raw_email_identifier: string;
      json_email_identifier: string;
      eml_redacted: boolean;
      location: string;
      latitude: number;
      longitude: number;
    };
    custom: Record<string, unknown>;
    suspension_type_id: number | null;
  };
};

export type ZendeskAttachment = {
  id: number;
  file_name: string;
  content_url: string;
  content_type: string;
  size: number;
  thumbnails?: Array<{
    id: number;
    file_name: string;
    content_url: string;
    content_type: string;
    size: number;
  }>;
};