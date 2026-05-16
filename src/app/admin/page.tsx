import { count, eq } from "drizzle-orm";

import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

import { getDb } from "@/db";

import {

  blogPosts,

  contactMessages,

  products,

  quotations,

  rfqSubmissions,

  tradeEnquiries,

} from "@/db/schema";



export default async function AdminDashboardPage() {

  const db = getDb();

  if (!db) {

    return (

      <div className="font-sans">

        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Dashboard</h1>

        <p className="text-[#1a1a1a]/50 max-w-md text-sm leading-relaxed">

          Set <code className="bg-[#F5F5F7] px-1.5 py-0.5 rounded-md text-[#1a1a1a]">DATABASE_URL</code> in{" "}

          <code className="bg-[#F5F5F7] px-1.5 py-0.5 rounded-md text-[#1a1a1a]">.env.local</code> and run{" "}

          <code className="bg-[#F5F5F7] px-1.5 py-0.5 rounded-md text-[#1a1a1a]">npx drizzle-kit push</code> to create

          tables in Neon.

        </p>

      </div>

    );

  }



  const [

    productCount,

    blogCount,

    messageCount,

    enquiryCount,

    rfqCount,

    quoteCount,

    newContacts,

    newQuotes,

  ] = await Promise.all([

    db.select({ c: count() }).from(products).then((r) => r[0].c),

    db.select({ c: count() }).from(blogPosts).then((r) => r[0].c),

    db.select({ c: count() }).from(contactMessages).then((r) => r[0].c),

    db.select({ c: count() }).from(tradeEnquiries).then((r) => r[0].c),

    db.select({ c: count() }).from(rfqSubmissions).then((r) => r[0].c),

    db.select({ c: count() }).from(quotations).then((r) => r[0].c),

    db

      .select({ c: count() })

      .from(contactMessages)

      .where(eq(contactMessages.status, "new"))

      .then((r) => r[0].c),

    db

      .select({ c: count() })

      .from(quotations)

      .where(eq(quotations.status, "new"))

      .then((r) => r[0].c),

  ]);



  return (

    <AdminDashboardView

      productCount={productCount}

      blogCount={blogCount}

      messageCount={messageCount}

      enquiryCount={enquiryCount}

      rfqCount={rfqCount}

      quoteCount={quoteCount}

      newContacts={newContacts}

      newQuotes={newQuotes}

    />

  );

}

