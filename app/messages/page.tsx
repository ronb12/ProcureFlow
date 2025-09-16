'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AppHeader } from '@/components/ui/app-header';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Clock, 
  Check, 
  CheckCheck,
  Paperclip,
  Smile,
  AlertCircle,
  Users,
  FileText,
  Shield
} from 'lucide-react';

// Mock message data
const mockUsers = [
  { id: 'user1', name: 'John Smith', role: 'requester', email: 'john.smith@dod.mil', avatar: 'JS', online: true },
  { id: 'user2', name: 'Jane Doe', role: 'approver', email: 'jane.doe@dod.mil', avatar: 'JD', online: true },
  { id: 'user3', name: 'Mike Johnson', role: 'cardholder', email: 'mike.johnson@dod.mil', avatar: 'MJ', online: false },
  { id: 'user4', name: 'Alice Brown', role: 'auditor', email: 'alice.brown@dod.mil', avatar: 'AB', online: true },
  { id: 'user5', name: 'Bob Green', role: 'admin', email: 'bob.green@dod.mil', avatar: 'BG', online: true },
  { id: 'user6', name: 'Sarah Wilson', role: 'approver', email: 'sarah.wilson@dod.mil', avatar: 'SW', online: false },
  { id: 'user7', name: 'David Taylor', role: 'cardholder', email: 'david.taylor@dod.mil', avatar: 'DT', online: true },
  { id: 'user8', name: 'Carol Davis', role: 'requester', email: 'carol.davis@dod.mil', avatar: 'CD', online: false }
];

const mockMessageThreads = [
  {
    id: 'thread1',
    participants: ['user1', 'user2'],
    requestId: 'REQ-2024-001',
    subject: 'Office Supplies Request - REQ-2024-001',
    lastMessage: 'The approval has been processed and sent to cardholder.',
    lastMessageTime: '2024-01-15T10:30:00Z',
    unreadCount: 2,
    priority: 'normal',
    type: 'request',
    status: 'active'
  },
  {
    id: 'thread2',
    participants: ['user4', 'user3'],
    requestId: 'AUDIT-2024-001',
    subject: 'Audit Findings - REQ-2024-002',
    lastMessage: 'Please review the compliance issues found in your purchase.',
    lastMessageTime: '2024-01-15T09:15:00Z',
    unreadCount: 1,
    priority: 'high',
    type: 'audit',
    status: 'active'
  },
  {
    id: 'thread3',
    participants: ['user1', 'user4', 'user5'],
    requestId: null,
    subject: 'General Discussion - Q1 Compliance Review',
    lastMessage: 'The quarterly compliance review is scheduled for next week.',
    lastMessageTime: '2024-01-14T16:45:00Z',
    unreadCount: 0,
    priority: 'normal',
    type: 'general',
    status: 'active'
  },
  {
    id: 'thread4',
    participants: ['user6', 'user7'],
    requestId: 'REQ-2024-003',
    subject: 'Equipment Purchase - REQ-2024-003',
    lastMessage: 'The purchase order has been created successfully.',
    lastMessageTime: '2024-01-14T14:20:00Z',
    unreadCount: 0,
    priority: 'normal',
    type: 'request',
    status: 'resolved'
  }
];

const mockMessages = [
  {
    id: 'msg1',
    threadId: 'thread1',
    senderId: 'user1',
    recipientId: 'user2',
    content: 'Hi Jane, I need approval for the office supplies request. The total amount is $1,250 and all items are within policy.',
    timestamp: '2024-01-15T10:00:00Z',
    read: false,
    type: 'text',
    attachments: []
  },
  {
    id: 'msg2',
    threadId: 'thread1',
    senderId: 'user2',
    recipientId: 'user1',
    content: 'I\'ve reviewed your request. Everything looks good. I\'ll process the approval now.',
    timestamp: '2024-01-15T10:15:00Z',
    read: true,
    type: 'text',
    attachments: []
  },
  {
    id: 'msg3',
    threadId: 'thread1',
    senderId: 'user2',
    recipientId: 'user1',
    content: 'The approval has been processed and sent to cardholder.',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    type: 'text',
    attachments: []
  },
  {
    id: 'msg4',
    threadId: 'thread2',
    senderId: 'user4',
    recipientId: 'user3',
    content: 'Please review the compliance issues found in your purchase. There are 3 critical issues that need immediate attention.',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    type: 'text',
    attachments: ['audit-findings.pdf']
  }
];

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [composeType, setComposeType] = useState('general');

  // Mock current user - in real app, this would come from auth
  const currentUser = { id: 'user1', name: 'John Smith', role: 'requester' };

  const filteredThreads = mockMessageThreads.filter(thread => {
    const matchesSearch = thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || thread.type === filterType;
    const matchesPriority = filterPriority === 'all' || thread.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const getThreadMessages = (threadId: string) => {
    return mockMessages.filter(msg => msg.threadId === threadId);
  };

  const getThreadParticipants = (threadId: string) => {
    const thread = mockMessageThreads.find(t => t.id === threadId);
    if (!thread) return [];
    return thread.participants.map(pid => mockUsers.find(u => u.id === pid)).filter(Boolean);
  };

  const getUserById = (userId: string) => {
    return mockUsers.find(u => u.id === userId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread) return;
    
    // In real app, this would send to Firebase
    console.log('Sending message:', {
      threadId: selectedThread,
      content: newMessage,
      senderId: currentUser.id
    });
    
    setNewMessage('');
  };

  const handleComposeMessage = () => {
    if (!composeTo || !composeSubject || !composeMessage) return;
    
    // In real app, this would create new thread and send message
    console.log('Composing message:', {
      to: composeTo,
      subject: composeSubject,
      content: composeMessage,
      type: composeType
    });
    
    setShowCompose(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeMessage('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'request': return <FileText className="h-4 w-4" />;
      case 'audit': return <Shield className="h-4 w-4" />;
      case 'general': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'request': return 'text-blue-600';
      case 'audit': return 'text-red-600';
      case 'general': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="mt-2 text-gray-600">
                Communicate with your team and manage procurement discussions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center space-x-2"
              >
                <span>Dashboard</span>
              </Button>
              <Button
                onClick={() => setShowCompose(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>New Message</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Threads List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Conversations</span>
                  </CardTitle>
                  <Badge variant="secondary">{filteredThreads.length}</Badge>
                </div>
                
                {/* Search and Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="request">Requests</SelectItem>
                        <SelectItem value="audit">Audits</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => setSelectedThread(thread.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                        selectedThread === thread.id 
                          ? 'bg-blue-50 border-l-blue-500' 
                          : 'border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`${getTypeColor(thread.type)}`}>
                              {getTypeIcon(thread.type)}
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {thread.subject}
                            </h3>
                            {thread.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {thread.unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-600 truncate mb-2">
                            {thread.lastMessage}
                          </p>
                          
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(thread.priority)}`}
                            >
                              {thread.priority.toUpperCase()}
                            </Badge>
                            
                            <span className="text-xs text-gray-500">
                              {new Date(thread.lastMessageTime).toLocaleDateString()}
                            </span>
                            
                            {thread.requestId && (
                              <span className="text-xs text-blue-600 font-medium">
                                {thread.requestId}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {getThreadParticipants(thread.id).slice(0, 3).map((participant, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600"
                            >
                              {participant?.avatar}
                            </div>
                          ))}
                          {thread.participants.length > 3 && (
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                              +{thread.participants.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Thread View */}
          <div className="lg:col-span-2">
            {selectedThread ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {mockMessageThreads.find(t => t.id === selectedThread)?.subject}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {getThreadParticipants(selectedThread).map(p => p?.name).join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={getPriorityColor(
                          mockMessageThreads.find(t => t.id === selectedThread)?.priority || 'normal'
                        )}
                      >
                        {mockMessageThreads.find(t => t.id === selectedThread)?.priority?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {getThreadMessages(selectedThread).map((message) => {
                      const sender = getUserById(message.senderId);
                      const isCurrentUser = message.senderId === currentUser.id;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium">
                                {sender?.name}
                              </span>
                              <span className="text-xs opacity-75">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 flex items-center space-x-1">
                                <Paperclip className="h-3 w-3" />
                                <span className="text-xs">
                                  {message.attachments.length} attachment(s)
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-end mt-1">
                              {message.read ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 min-h-[60px]"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="flex flex-col space-y-2">
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Compose Message Modal */}
        {showCompose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Compose Message</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowCompose(false)}
                >
                  ✕ Close
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <Select value={composeTo} onValueChange={setComposeTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers
                        .filter(user => user.id !== currentUser.id)
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center space-x-2">
                              <span>{user.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <Select value={composeType} onValueChange={setComposeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Discussion</SelectItem>
                      <SelectItem value="request">Request Related</SelectItem>
                      <SelectItem value="audit">Audit Related</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                    placeholder="Enter message subject..."
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    placeholder="Type your message..."
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCompose(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleComposeMessage}
                    disabled={!composeTo || !composeSubject || !composeMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
