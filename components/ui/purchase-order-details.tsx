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
// import { StatusBadge } from './status-badge';
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

      {/* Items - Federal Government Line Item Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Line Item Detail</CardTitle>
          <CardDescription>
            {purchaseOrder.items.length} item(s) in this purchase order -
            Federal Government requires detailed itemization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Line #
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    SKU/Part #
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Qty
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Unit Price
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Line Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrder.items.map((item, index) => (
                  <tr
                    key={`${item.sku}-${index}`}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-mono text-sm">
                      {item.sku}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{item.desc}</td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {item.qty}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(item.estUnitPrice)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                      {formatCurrency(item.qty * item.estUnitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-100">
                  <td
                    colSpan={5}
                    className="py-3 px-4 text-right font-semibold text-gray-900"
                  >
                    Subtotal:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    {formatCurrency(purchaseOrder.subtotal)}
                  </td>
                </tr>
                <tr className="border-b bg-gray-100">
                  <td
                    colSpan={5}
                    className="py-3 px-4 text-right font-semibold text-gray-900"
                  >
                    Tax:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    {formatCurrency(purchaseOrder.tax)}
                  </td>
                </tr>
                <tr className="border-b bg-gray-100">
                  <td
                    colSpan={5}
                    className="py-3 px-4 text-right font-semibold text-gray-900"
                  >
                    Shipping:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    {formatCurrency(purchaseOrder.shipping)}
                  </td>
                </tr>
                <tr className="bg-blue-50 border-t-2 border-blue-300">
                  <td
                    colSpan={5}
                    className="py-3 px-4 text-right font-bold text-blue-900 text-lg"
                  >
                    TOTAL:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-900 text-lg">
                    {formatCurrency(purchaseOrder.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Federal Compliance Notice */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Federal Government Compliance
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>
                    This purchase order includes detailed line item breakdown as
                    required by federal procurement regulations. Each item is
                    individually specified with SKU, description, quantity, and
                    unit pricing for audit compliance.
                  </p>
                </div>
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
