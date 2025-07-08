export interface Notification {
  _id: string;
  title: string;
  message: string;
  area: {
    type: "Polygon";
    coordinates: number[][][];
  };
  roles: string[];
  sentTo: string[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  area: {
    type: "Polygon";
    coordinates: number[][][];
  };
  roles: string[];
  startDate: string;
  endDate: string;
}

export interface UpdateNotificationDto extends Partial<CreateNotificationDto> {
  isRead?: boolean;
  sentTo?: string[];
}

export interface NotificationStats {
  total: number;
  unread: number;
  active: number;
  expired: number;
}
