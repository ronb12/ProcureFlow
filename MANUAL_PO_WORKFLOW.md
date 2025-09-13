# Manual Purchase Order Creation Workflow

## Workflow Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Request       │    │   Request        │    │   Request       │
│   Submitted     │───▶│   AO Review      │───▶│   Approved      │
│   (Requester)   │    │   (Approver)     │    │   (Approver)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Purchase      │    │   Purchase       │    │   Purchase      │
│   Order         │◀───│   Order          │◀───│   Order         │
│   Sent          │    │   Created        │    │   Creation      │
│   (Cardholder)  │    │   (Cardholder)   │    │   Required      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Purchase      │    │   Purchase       │    │   Purchase      │
│   Completed     │    │   In Progress    │    │   Order         │
│   (Cardholder)  │    │   (Cardholder)   │    │   Draft         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Detailed Process Flow

### 1. Request Approval
- **Requester** submits purchase request
- **Approver** reviews and approves request
- Request status: `Approved`
- **Cardholder** receives notification

### 2. Purchase Order Creation (Manual)
- **Cardholder** reviews approved request
- **Cardholder** clicks "Create Purchase Order" button
- System opens PO creation form with pre-populated data
- **Cardholder** can modify:
  - Vendor details
  - Delivery address
  - Item specifications
  - Quantities
  - Terms and conditions
  - Special instructions

### 3. PO Validation & Review
- System validates PO data
- **Cardholder** reviews final PO details
- **Cardholder** corrects any requester mistakes
- PO status: `Draft`

### 4. PO Confirmation & Sending
- **Cardholder** clicks "Send Purchase Order"
- PO status: `Sent`
- Purchase process begins
- **Cardholder** can track PO status

### 5. Purchase Completion
- **Cardholder** completes actual purchase
- **Cardholder** uploads receipt
- Request status: `Purchased`
- Reconciliation process begins

## Key Benefits of Manual Approach

### ✅ Error Prevention
- **Requester Mistakes**: Cardholder catches and corrects errors
- **Vendor Issues**: Verify vendor details before sending
- **Specification Errors**: Ensure items match actual needs
- **Compliance Issues**: Final review against MWR rules

### ✅ Quality Control
- **Data Accuracy**: Verify all information before PO creation
- **Vendor Validation**: Confirm vendor is approved and current
- **Delivery Verification**: Ensure correct delivery address
- **Terms Review**: Confirm appropriate payment/shipping terms

### ✅ MWR Compliance
- **Procurement Rules**: Follow military procurement standards
- **Documentation**: Complete audit trail of all changes
- **Approval Limits**: Respect cardholder spending thresholds
- **Vendor Approval**: Ensure only approved vendors used

## UI Components Needed

### 1. Cardholder Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  Approved Requests Ready for PO Creation               │
├─────────────────────────────────────────────────────────┤
│  Request #1234 - Office Supplies                       │
│  Vendor: Office Depot | Amount: $1,250.00              │
│  [Create Purchase Order] [View Details]                │
├─────────────────────────────────────────────────────────┤
│  Request #1235 - Computer Equipment                    │
│  Vendor: Dell | Amount: $3,500.00                      │
│  [Create Purchase Order] [View Details]                │
└─────────────────────────────────────────────────────────┘
```

### 2. PO Creation Form
```
┌─────────────────────────────────────────────────────────┐
│  Create Purchase Order - Request #1234                 │
├─────────────────────────────────────────────────────────┤
│  Vendor Information:                                   │
│  [Edit] Office Depot - 123 Main St, City, State        │
│                                                         │
│  Delivery Address:                                      │
│  [Edit] MWR Facility - 456 Base Rd, City, State        │
│                                                         │
│  Items:                                                 │
│  [Edit] Office Chairs (4) - $150.00 each               │
│  [Edit] Desk Lamps (2) - $45.00 each                   │
│                                                         │
│  Terms:                                                 │
│  [Edit] Payment: Net 30 | Shipping: FOB Destination    │
│                                                         │
│  Special Instructions:                                  │
│  [Text Area]                                           │
│                                                         │
│  [Save Draft] [Send Purchase Order] [Cancel]           │
└─────────────────────────────────────────────────────────┘
```

### 3. PO Status Tracking
```
┌─────────────────────────────────────────────────────────┐
│  Purchase Order #PO-2024-001                           │
├─────────────────────────────────────────────────────────┤
│  Status: Sent | Created: Jan 15, 2024                  │
│  Vendor: Office Depot | Amount: $1,250.00              │
│                                                         │
│  Timeline:                                              │
│  ✅ Created - Jan 15, 2024 10:30 AM                    │
│  ✅ Sent - Jan 15, 2024 10:45 AM                       │
│  ⏳ Acknowledged - Pending                             │
│  ⏳ Shipped - Pending                                  │
│  ⏳ Delivered - Pending                                │
│                                                         │
│  [View PO Details] [Track Shipment] [Upload Receipt]   │
└─────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Phase 1: Basic Manual PO Creation
1. Add "Create Purchase Order" button to cardholder dashboard
2. Create PO creation form with pre-populated data
3. Implement PO draft saving
4. Add basic validation

### Phase 2: Enhanced PO Management
1. Add PO editing capabilities
2. Implement PO status tracking
3. Add vendor validation
4. Create PO templates

### Phase 3: Advanced Features
1. Add PO approval workflows
2. Implement bulk PO operations
3. Add advanced reporting
4. Create PO analytics

## Success Metrics

### Quality Metrics
- **Error Rate**: Reduce PO errors by 80%
- **Compliance**: 100% MWR rule adherence
- **Accuracy**: 95% correct vendor/item details
- **Audit Score**: 100% audit readiness

### Efficiency Metrics
- **Time to PO**: Average 2 hours (vs 1 day manual)
- **User Satisfaction**: 90%+ cardholder satisfaction
- **Process Speed**: 50% faster than current process
- **Error Correction**: 90% of errors caught before sending

## Conclusion

Manual PO creation provides the quality control and compliance needed for MWR procurement while maintaining efficiency through pre-populated forms and validation. This approach ensures cardholders can catch and correct requester mistakes before they become compliance issues.
