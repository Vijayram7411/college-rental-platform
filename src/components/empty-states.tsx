// Reusable Empty State Components
import Link from "next/link";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flipkart-shadow rounded-sm bg-white p-12 text-center">
      <div className="mb-4 text-6xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-[#212121]">{title}</h3>
      <p className="mb-6 text-sm text-gray-600">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-block rounded-sm bg-[#2874f0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1c5bbf]"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="rounded-sm bg-[#2874f0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1c5bbf]"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function NoProductsEmpty() {
  return (
    <EmptyState
      icon="📦"
      title="No products yet"
      description="Start listing your items for rent and earn money!"
      actionLabel="Add Your First Product"
      actionHref="/owner/products/add"
    />
  );
}

export function NoOrdersEmpty() {
  return (
    <EmptyState
      icon="📦"
      title="No orders yet"
      description="Orders for your products will appear here"
    />
  );
}

export function NoBorrowedEmpty() {
  return (
    <EmptyState
      icon="📦"
      title="No borrowed items yet"
      description="Start browsing the catalog to rent items from your college"
      actionLabel="Browse Catalog"
      actionHref="/catalog"
    />
  );
}

export function EmptyCartState() {
  return (
    <EmptyState
      icon="🛒"
      title="Your cart is empty"
      description="Browse our catalog and add items to your cart"
      actionLabel="Browse Catalog"
      actionHref="/catalog"
    />
  );
}

export function NoSearchResults({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No products found"
      description="Try adjusting your filters or search query"
      actionLabel="Clear Filters"
      onAction={onClear}
    />
  );
}

export function NoReviewsEmpty() {
  return (
    <div className="rounded-sm bg-gray-50 p-6 text-center">
      <div className="mb-2 text-3xl">⭐</div>
      <p className="text-sm text-gray-600">
        No reviews yet. Be the first to review this product!
      </p>
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="flipkart-shadow rounded-sm bg-white p-12 text-center">
      <div className="mb-4 text-6xl">⚠️</div>
      <h3 className="mb-2 text-lg font-semibold text-[#212121]">
        Something went wrong
      </h3>
      <p className="mb-6 text-sm text-gray-600">
        {message || "We couldn't load this content. Please try again later."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-sm bg-[#2874f0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1c5bbf]"
      >
        Refresh Page
      </button>
    </div>
  );
}

export function UnauthorizedState() {
  return (
    <EmptyState
      icon="🔒"
      title="Access Denied"
      description="You need to be logged in to view this page"
      actionLabel="Go to Login"
      actionHref="/login"
    />
  );
}

export function NotFoundState() {
  return (
    <EmptyState
      icon="🔍"
      title="Page Not Found"
      description="The page you're looking for doesn't exist"
      actionLabel="Go to Home"
      actionHref="/"
    />
  );
}
