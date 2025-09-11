'use client';

import { useState } from 'react';
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import { StatusBadge } from './status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PurchaseOrder } from '@/lib/types';
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface PurchaseOrderDetailsProps {
  purchaseOrder: PurchaseOrder;
  onStatusUpdate?: (status: string) => void;
  onSend?: () => void;
  onAcknowledge?: () => void;
  onMarkShipped?: () => void;
  onMarkDelivered?: () => void;
}

export function PurchaseOrderDetails({
  purchaseOrder,
  onStatusUpdate,
  onSend,
  onAcknowledge,
  onMarkShipped,
  onMarkDelivered,
}: PurchaseOrderDetailsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'sent':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'acknowledged':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-gray-600 bg-gray-50';
      case 'sent':
        return 'text-blue-600 bg-blue-50';
      case 'acknowledged':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleAction = async (action: () => void) => {
    setIsProcessing(true);
    try {
      await action();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Purchase Order #{purchaseOrder.poNumber}
          </h1>
          <p className="text-gray-600">
            Created {formatDate(purchaseOrder.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(purchaseOrder.status)}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              purchaseOrder.status
            )}`}
          >
            {purchaseOrder.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        {purchaseOrder.status === 'draft' && onSend && (
          <Button
            onClick={() => handleAction(onSend)}
            disabled={isProcessing}
            className="flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Send PO</span>
          </Button>
        )}
        {purchaseOrder.status === 'sent' && onAcknowledge && (
          <Button
            onClick={() => handleAction(onAcknowledge)}
            disabled={isProcessing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark Acknowledged</span>
          </Button>
        )}
        {purchaseOrder.status === 'acknowledged' && onMarkShipped && (
          <Button
            onClick={() => handleAction(onMarkShipped)}
            disabled={isProcessing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Truck className="h-4 w-4" />
            <span>Mark Shipped</span>
          </Button>
        )}
        {purchaseOrder.status === 'shipped' && onMarkDelivered && (
          <Button
            onClick={() => handleAction(onMarkDelivered)}
            disabled={isProcessing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Package className="h-4 w-4" />
            <span>Mark Delivered</span>
          </Button>
        )}
        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export PDF</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Vendor Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                {purchaseOrder.vendor.name}
              </h3>
              <p className="text-sm text-gray-600">
                {purchaseOrder.vendor.address}
              </p>
              <p className="text-sm text-gray-600">
                {purchaseOrder.vendor.city}, {purchaseOrder.vendor.state}{' '}
                {purchaseOrder.vendor.zip}
              </p>
            </div>
            {purchaseOrder.vendor.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{purchaseOrder.vendor.phone}</span>
              </div>
            )}
            {purchaseOrder.vendor.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{purchaseOrder.vendor.email}</span>
              </div>
            )}
            {purchaseOrder.vendor.taxId && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Tax ID:
                </span>{' '}
                <span className="text-sm">{purchaseOrder.vendor.taxId}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Delivery Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                {purchaseOrder.delivery.contactName}
              </h3>
              <p className="text-sm text-gray-600">
                {purchaseOrder.delivery.address}
              </p>
              <p className="text-sm text-gray-600">
                {purchaseOrder.delivery.city}, {purchaseOrder.delivery.state}{' '}
                {purchaseOrder.delivery.zip}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {purchaseOrder.delivery.contactPhone}
              </span>
            </div>
            {purchaseOrder.delivery.specialInstructions && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Special Instructions:
                </span>
                <p className="text-sm text-gray-600">
                  {purchaseOrder.delivery.specialInstructions}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cardholder Information */}
        <Card>
          <CardHeader>
            <CardTitle>Cardholder Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                {purchaseOrder.cardholder.name}
              </h3>
              <p className="text-sm text-gray-600">
                {purchaseOrder.cardholder.email}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Card Number:
              </span>{' '}
              <span className="text-sm font-mono">
                {purchaseOrder.cardholder.cardNumber}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Card Type:
              </span>{' '}
              <span className="text-sm">
                {purchaseOrder.cardholder.cardType}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Terms & Conditions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Payment Terms:
              </span>{' '}
              <span className="text-sm">
                {purchaseOrder.terms.paymentTerms}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Shipping Terms:
              </span>{' '}
              <span className="text-sm">
                {purchaseOrder.terms.shippingTerms}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Delivery Date:
              </span>{' '}
              <span className="text-sm">
                {formatDate(purchaseOrder.terms.deliveryDate)}
              </span>
            </div>
            {purchaseOrder.terms.warranty && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Warranty:
                </span>{' '}
                <span className="text-sm">{purchaseOrder.terms.warranty}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>
            {purchaseOrder.items.length} item(s) in this purchase order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purchaseOrder.items.map((item, index) => (
              <div
                key={`${item.sku}-${index}`}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900">
                      {item.sku}
                    </span>
                    <span className="text-gray-600">{item.desc}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Qty: {item.qty} × {formatCurrency(item.estUnitPrice)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(item.qty * item.estUnitPrice)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="text-sm">
                  {formatCurrency(purchaseOrder.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tax:</span>
                <span className="text-sm">
                  {formatCurrency(purchaseOrder.tax)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Shipping:</span>
                <span className="text-sm">
                  {formatCurrency(purchaseOrder.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(purchaseOrder.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Information */}
      {purchaseOrder.trackingNumber && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Tracking Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Tracking Number:
                </span>{' '}
                <span className="text-sm font-mono">
                  {purchaseOrder.trackingNumber}
                </span>
              </div>
              {purchaseOrder.shippedAt && (
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Shipped:
                  </span>{' '}
                  <span className="text-sm">
                    {formatDate(purchaseOrder.shippedAt)}
                  </span>
                </div>
              )}
              {purchaseOrder.deliveredAt && (
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Delivered:
                  </span>{' '}
                  <span className="text-sm">
                    {formatDate(purchaseOrder.deliveredAt)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {purchaseOrder.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{purchaseOrder.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
