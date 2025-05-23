// 提取 partnerList
const getPartnerList = (messages, userId) => {
  const partnerSet = new Map();

  messages.forEach((message) => {
    const isSender = message.senderId.toString() === userId.toString();
    const partnerId = isSender
      ? message.receiverId.toString()
      : message.senderId.toString();
    const partnerName = isSender ? message.receiverName : message.senderName;

    // 初始化 partner
    if (!partnerSet.has(partnerId)) {
      partnerSet.set(partnerId, {
        userId: partnerId,
        username: partnerName,
        unReadCount: 0,
      });
    }

    // 更新未讀數量
    if (!message.isRead && !isSender) {
      const partnerData = partnerSet.get(partnerId);
      partnerSet.set(partnerId, {
        ...partnerData,
        unReadCount: partnerData.unReadCount + 1,
      });
    }
  });

  return Array.from(partnerSet.values());
};

// 提取 conversation
const getConversations = (messages, userId) => {
  const result = {};

  messages.forEach((message) => {
    const isSender = message.senderId.toString() === userId.toString();
    const partnerId = isSender
      ? message.receiverId.toString()
      : message.senderId.toString();
    const partnerName = isSender ? message.receiverName : message.senderName;

    if (!result[partnerId]) {
      result[partnerId] = {
        partnerId,
        partnerName,
        messages: [],
      };
    }

    result[partnerId].messages.push({
      isSender,
      senderName: message.senderName,
      content: message.content,
      isRead: isSender ? true : message.isRead,
      messageId: message._id,
      senderId: isSender ? userId : partnerId,
    });
  });

  return Object.values(result);
};

// 判斷是否有新消息
const getHasNewMessage = (messages, lastLogoutTime) => {
  return messages.some(
    (message) => new Date(message.timestamp) > new Date(lastLogoutTime)
  );
};

module.exports = { getPartnerList, getConversations, getHasNewMessage };
