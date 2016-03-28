struct Message {
    1: string src,
    2: string dest,
    3: string content,
    4: string type,
    5: i64 timestamp
}

service NotificationService {
    void postMessage(1:Message message)
}
