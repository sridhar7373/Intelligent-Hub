import { NextResponse } from "next/server";
import { HttpException } from "./http-exception";

export function handleApiError(err: any) {
    if (err instanceof HttpException) {
        return NextResponse.json(
            {
                status: err.status,
                error: err.code || "ERROR",
                message: err.message,
                details: err.details || null
            },
            { status: err.status }
        );
    }

    return NextResponse.json(
        {
            status: 500,
            error: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong.",
        },
        { status: 500 }
    );
}