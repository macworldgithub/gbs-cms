import {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../types/notification";

const API_BASE_URL = "http://localhost:9000/";

class NotificationService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async findAll(): Promise<Notification[]> {
    return this.request<Notification[]>("notification");
  }

  async findOne(id: string): Promise<Notification> {
    return this.request<Notification>(`notification/${id}`);
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    return this.request<Notification>("notification", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  async update(id: string, dto: UpdateNotificationDto): Promise<Notification> {
    return this.request<Notification>(`notification/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
  }

  async delete(id: string): Promise<void> {
    await this.request<void>(`notification/${id}`, {
      method: "DELETE",
    });
  }

  async getStats(): Promise<any> {
    const notifications = await this.findAll();
    return {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      byType: notifications.reduce((acc, n) => {
        //@ts-ignore
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPriority: notifications.reduce((acc, n) => {
        //@ts-ignore
        acc[n.priority] = (acc[n.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export const notificationService = new NotificationService();
