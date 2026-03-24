import { NextRequest, NextResponse } from "next/server";

import { getNewsPage, saveNewsItem } from "@/utils/news";
import { validateNewsSubmission } from "@/utils/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor");
    const newsPage = await getNewsPage(cursor);

    return NextResponse.json(newsPage, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load the latest news right now. Try again in a moment.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message: "Request body must contain valid JSON.",
        },
        { status: 400 },
      );
    }

    const validation = validateNewsSubmission(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          ok: false,
          message:
            validation.error.issues[0]?.message ?? "Invalid article input.",
        },
        { status: 400 },
      );
    }

    const slug = await saveNewsItem(validation.data);

    return NextResponse.json({
      ok: true,
      message: "News article created successfully.",
      slug,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "The article could not be saved. Check the server logs and try again.",
      },
      { status: 500 },
    );
  }
}
