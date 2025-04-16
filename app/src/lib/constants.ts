export enum Role {
  TRADESPERSON = 'tradesperson',
  EMPLOYER = 'employer',
}

export enum Status {
  ONLINE = 'online',
  IDLE = 'idle',
}

export enum JobApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export enum HireRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  JOB_APPLICATION = 'job_application',
  HIRE_REQUEST = 'hire_request',
  MESSAGE = 'message',
  REVIEW = 'review',
  WORK_POST = 'work_post',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  LOCATION = 'location',
}
