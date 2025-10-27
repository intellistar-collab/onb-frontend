import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeographicDistributionCardProps } from "./types";

export const GeographicDistributionCard: React.FC<GeographicDistributionCardProps> = ({
  players,
  className
}) => {
  const getCountryData = () => {
    const countryMap = new Map<string, number>();
    
    players.forEach(player => {
      const country = player.country;
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });

    return Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  };

  const countryData = getCountryData();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>Players by country</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {countryData.map(({ country, count }) => (
            <div key={country} className="flex items-center justify-between">
              <span className="admin-text-primary">{country}</span>
              <span className="admin-text-tertiary">{count} players</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
