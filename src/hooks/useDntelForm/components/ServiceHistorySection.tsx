import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceHistorySectionProps } from "../index";

export const ServiceHistorySection = React.memo(
    ({ section, renderField }: ServiceHistorySectionProps) => {
        return (
            <div className="grid grid-cols-1 gap-4">
                {Object.entries(section.fields).map(
                    ([categoryKey, categoryData]) => (
                        <Card
                            key={categoryKey}
                            className="overflow-hidden py-0 gap-0"
                        >
                            <CardHeader className="bg-gray-50 p-4">
                                <CardTitle className="text-base">
                                    {categoryData.Category.value}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                    {categoryData.Services.map(
                                        (service: any, index: number) => (
                                            <div
                                                key={index}
                                                className="space-y-4"
                                            >
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        {renderField(
                                                            service.CDTCode.key,
                                                            service.CDTCode,
                                                            section.bgColor
                                                        )}
                                                    </div>
                                                    <div>
                                                        {renderField(
                                                            service.FriendlyName
                                                                .key,
                                                            service.FriendlyName,
                                                            section.bgColor
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    {renderField(
                                                        service.LastServiceDate
                                                            .key,
                                                        service.LastServiceDate,
                                                        section.bgColor
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                )}
            </div>
        );
    }
);
