import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // If Resend is not configured, log to console
  if (!resend || !process.env.RESEND_API_KEY) {
    console.log("⚠️ RESEND_API_KEY not configured. Email would be sent to:", to);
    console.log("📧 Subject:", subject);
    console.log("💡 To enable emails, add RESEND_API_KEY to your .env file");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'College Rentals <onboarding@resend.dev>', // Use resend.dev domain for testing
      to,
      subject,
      html,
    });

    if (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error };
    }

    console.log('✅ Email sent successfully to:', to);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return { success: false, error };
  }
}

export function generateNewOrderEmail({
  ownerName,
  borrowerName,
  borrowerEmail,
  borrowerPhone,
  productTitle,
  quantity,
  duration,
  totalAmount,
  pickupPoint,
  orderDate,
}: {
  ownerName: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string | null;
  productTitle: string;
  quantity: number;
  duration: number;
  totalAmount: number;
  pickupPoint: string;
  orderDate: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Rental Order</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #2874f0 0%, #1c5bbf 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 New Rental Order!</h1>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-bottom: 20px;">Hi ${ownerName},</p>
    
    <p style="font-size: 16px; margin-bottom: 25px;">
      Great news! Someone wants to borrow your item. Here are the details:
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2874f0;">
      <h2 style="color: #2874f0; margin-top: 0; font-size: 20px;">📦 Order Details</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Item:</td>
          <td style="padding: 8px 0;">${productTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Quantity:</td>
          <td style="padding: 8px 0;">${quantity} pcs</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Duration:</td>
          <td style="padding: 8px 0;">${duration} days</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Total Amount:</td>
          <td style="padding: 8px 0; font-size: 18px; color: #2874f0; font-weight: bold;">₹${totalAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Order Date:</td>
          <td style="padding: 8px 0;">${orderDate}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff9f00;">
      <h2 style="color: #ff9f00; margin-top: 0; font-size: 20px;">👤 Borrower Information</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Name:</td>
          <td style="padding: 8px 0;">${borrowerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${borrowerEmail}" style="color: #2874f0;">${borrowerEmail}</a></td>
        </tr>
        ${borrowerPhone ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:${borrowerPhone}" style="color: #2874f0;">${borrowerPhone}</a></td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #388e3c;">
      <h2 style="color: #388e3c; margin-top: 0; font-size: 20px;">📍 Pickup Point</h2>
      <p style="margin: 0; font-size: 16px;">${pickupPoint}</p>
    </div>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
      <p style="margin: 0; color: #856404;">
        <strong>⚠️ Next Steps:</strong><br>
        Please contact the borrower to arrange the pickup time and location. Make sure to verify their student ID before handing over the item.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXTAUTH_URL}/owner/orders" 
         style="display: inline-block; background: #2874f0; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
        View Order Details
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
      This is an automated notification from College Rentals Platform.<br>
      If you have any questions, please contact support.
    </p>
  </div>
</body>
</html>
  `;
}

export function generateOrderConfirmationEmail({
  borrowerName,
  productTitle,
  ownerName,
  ownerEmail,
  quantity,
  duration,
  totalAmount,
  pickupPoint,
  orderDate,
}: {
  borrowerName: string;
  productTitle: string;
  ownerName: string;
  ownerEmail: string;
  quantity: number;
  duration: number;
  totalAmount: number;
  pickupPoint: string;
  orderDate: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #388e3c 0%, #2e7d32 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-bottom: 20px;">Hi ${borrowerName},</p>
    
    <p style="font-size: 16px; margin-bottom: 25px;">
      Your rental order has been placed successfully! Here are your order details:
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #388e3c;">
      <h2 style="color: #388e3c; margin-top: 0; font-size: 20px;">📦 Order Details</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Item:</td>
          <td style="padding: 8px 0;">${productTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Quantity:</td>
          <td style="padding: 8px 0;">${quantity} pcs</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Duration:</td>
          <td style="padding: 8px 0;">${duration} days</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Total Amount:</td>
          <td style="padding: 8px 0; font-size: 18px; color: #388e3c; font-weight: bold;">₹${totalAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Order Date:</td>
          <td style="padding: 8px 0;">${orderDate}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2874f0;">
      <h2 style="color: #2874f0; margin-top: 0; font-size: 20px;">👤 Owner Contact</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Name:</td>
          <td style="padding: 8px 0;">${ownerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${ownerEmail}" style="color: #2874f0;">${ownerEmail}</a></td>
        </tr>
      </table>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ff9f00;">
      <h2 style="color: #ff9f00; margin-top: 0; font-size: 20px;">📍 Pickup Point</h2>
      <p style="margin: 0; font-size: 16px;">${pickupPoint}</p>
    </div>
    
    <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-bottom: 25px;">
      <p style="margin: 0; color: #0c5460;">
        <strong>📞 Next Steps:</strong><br>
        The owner will contact you soon to arrange the pickup. Please have your student ID ready for verification.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXTAUTH_URL}/me/borrowed" 
         style="display: inline-block; background: #388e3c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
        View My Orders
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
      This is an automated confirmation from College Rentals Platform.<br>
      If you have any questions, please contact support.
    </p>
  </div>
</body>
</html>
  `;
}
