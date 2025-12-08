# Aadhaar Privacy Enhancement

## Overview
Updated the registration process to collect only partial Aadhaar numbers (first 4 and last 4 digits) instead of the full 12-digit number for enhanced privacy and security.

## Changes Made

### 1. Registration Form UI
**File:** `src/app/register/register-multi-step.tsx`

**Before:**
- Single input field for 12-digit Aadhaar number
- Full number stored in database

**After:**
- Two separate input fields:
  - First 4 digits
  - Last 4 digits
- Total 8 digits stored (format: 1234XXXX5678)
- Clear privacy message explaining partial collection

**Benefits:**
- Enhanced user privacy
- Reduced data breach risk
- Still provides verification capability
- Complies with data minimization principles

### 2. Validation Updates
**File:** `src/lib/validation.ts`

**Updated Schema:**
```typescript
aadhaarNumber: z.string().length(8).regex(/^\d{8}$/, "Aadhaar must be 8 digits (first 4 and last 4)")
```

**Validation:**
- Accepts exactly 8 digits
- Rejects non-numeric characters
- Clear error message for users

### 3. Form Validation
**Updated Check:**
```typescript
if (!aadhaarNumber || aadhaarNumber.length !== 8) {
  setError("Please enter both first 4 and last 4 digits of your Aadhaar number");
  return;
}
```

### 4. Database Schema
**File:** `prisma/schema.prisma`

**Updated Comment:**
```prisma
aadhaarNumber String?  // Stores only first 4 and last 4 digits (8 digits total)
```

## User Experience

### Registration Flow:
1. User reaches Step 2 of registration
2. Sees two separate fields:
   - "First 4 Digits" with placeholder "1234"
   - "Last 4 Digits" with placeholder "5678"
3. Privacy message: "For privacy, we only collect first 4 and last 4 digits (e.g., 1234-XXXX-5678)"
4. Both fields required before submission

### Input Behavior:
- Auto-filters non-numeric characters
- Maximum 4 digits per field
- Clear labels and placeholders
- Validation on submit

## Privacy Benefits

### Data Minimization:
- Collect only necessary information
- Reduce sensitive data storage
- Lower compliance burden

### Security:
- Partial number cannot be used for identity theft
- Reduced value to attackers
- Still provides verification capability

### Compliance:
- Aligns with privacy best practices
- Reduces GDPR/data protection concerns
- Demonstrates responsible data handling

## Technical Details

### Storage Format:
- Stored as 8-character string
- Example: "12345678" represents 1234-XXXX-5678
- First 4 digits: positions 0-3
- Last 4 digits: positions 4-7

### Display Format:
When displaying to users (if needed):
```typescript
const displayAadhaar = (partial: string) => {
  if (partial.length === 8) {
    return `${partial.slice(0, 4)}-XXXX-${partial.slice(4, 8)}`;
  }
  return partial;
};
```

## Migration Notes

### Existing Users:
If you have existing users with 12-digit Aadhaar numbers, you may want to:

1. **Option A - Keep existing data:**
   - No migration needed
   - New users will have 8 digits
   - Old users keep 12 digits

2. **Option B - Migrate to partial:**
   ```sql
   UPDATE User 
   SET aadhaarNumber = CONCAT(
     SUBSTRING(aadhaarNumber, 1, 4),
     SUBSTRING(aadhaarNumber, 9, 4)
   )
   WHERE LENGTH(aadhaarNumber) = 12;
   ```

## Testing Checklist

✅ Two input fields render correctly
✅ Only numeric input accepted
✅ Maximum 4 digits per field enforced
✅ Validation error shows for incomplete input
✅ Submit button disabled until both fields filled
✅ Privacy message displays
✅ API validation accepts 8 digits
✅ API validation rejects 12 digits
✅ Data stored correctly in database

## Future Enhancements

### Optional Improvements:
1. **Visual Masking:**
   - Show format: ●●●● - XXXX - ●●●●
   - Use bullet points for entered digits

2. **Auto-focus:**
   - Auto-move to second field after 4 digits

3. **Copy-Paste Handling:**
   - Parse full 12-digit number if pasted
   - Extract first 4 and last 4 automatically

4. **Verification Display:**
   - Show masked format in profile
   - Example: "Aadhaar: 1234-XXXX-5678"

## Summary

The Aadhaar collection has been updated to enhance user privacy by collecting only the first 4 and last 4 digits (8 digits total) instead of the full 12-digit number. This provides adequate verification capability while significantly reducing privacy and security risks.

**Key Points:**
- ✅ Enhanced privacy protection
- ✅ Reduced data breach risk
- ✅ Clear user communication
- ✅ Maintains verification capability
- ✅ Complies with data minimization principles
