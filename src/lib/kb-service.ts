import prisma from "@/lib/prisma";
import { Document } from "@/types/document";
import { BadRequestException, NotFoundException } from "./exceptions";

export class KBService {
    static async getBaseById(workspaceId: string, id: string) {
        const base = await prisma.knowledgeBase.findFirst({
            where: {
                id,
                workspaceId
            },
            include: {
                documents: true
            }
        });
        return base;
    }


    static async deleteBase(workspaceId: string, id: string) {
        const base = await prisma.knowledgeBase.delete({
            where: {
                id,
                workspaceId
            },
            include: {
                documents: true
            }
        });
        return base;
    }

    static async addDocument(document: Omit<Document,"id">)
    {
        try
        {
            const newDocument = await prisma.document.create({
                data: {
                    ...document
                }
            });
            return newDocument;
        }
        catch(err: any)
        {
            throw new BadRequestException(err.message);
        }
    }

    static async deleteDocument(baseId: string,id:string)
    {
        try
        {
            const existingDoc =  await prisma.document.findUnique({where:{id, baseId}});
            if(!existingDoc)
            {
                throw new NotFoundException("Document not found");
            }
            const deletedDoc = await prisma.document.delete({where:{ id, baseId}});
            return deletedDoc;
        }
        catch(err: any)
        {
            throw new BadRequestException(err.message);
        }
    }
}