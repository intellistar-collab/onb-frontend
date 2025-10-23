"use client";

import React from "react";
import { AdminCard } from "../admin-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  ExternalLink,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ReferralAnalyticsProps {
  referralData: {
    topSources: Array<{
      source: string;
      count: number;
      revenue: number;
      conversionRate: number;
    }>;
    topAffiliates: Array<{
      code: string;
      count: number;
      revenue: number;
      commission: number;
    }>;
    totalReferrals: number;
    totalRevenue: number;
    averageConversionRate: number;
  };
}

export const ReferralAnalytics: React.FC<ReferralAnalyticsProps> = ({ referralData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Referral Analytics</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Detailed Report
          </Button>
          <Button variant="outline" size="sm">
            <PieChart className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm admin-text-secondary">Total Referrals</p>
              <p className="text-2xl font-bold admin-text-primary">
                {referralData.totalReferrals.toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </AdminCard>

        <AdminCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm admin-text-secondary">Referral Revenue</p>
              <p className="text-2xl font-bold admin-text-primary">
                {formatPrice(referralData.totalRevenue)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </AdminCard>

        <AdminCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm admin-text-secondary">Avg Conversion</p>
              <p className="text-2xl font-bold admin-text-primary">
                {referralData.averageConversionRate.toFixed(1)}%
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </AdminCard>

        <AdminCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm admin-text-secondary">Active Sources</p>
              <p className="text-2xl font-bold admin-text-primary">
                {referralData.topSources.length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Referral Sources */}
        <AdminCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Top Referral Sources</h4>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {referralData.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium admin-text-primary">{source.source}</p>
                      <p className="text-sm admin-text-secondary">
                        {source.count} users • {source.conversionRate.toFixed(1)}% conversion
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold admin-text-primary">
                      {formatPrice(source.revenue)}
                    </p>
                    <p className="text-xs admin-text-tertiary">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>

        {/* Top Affiliates */}
        <AdminCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Top Affiliates</h4>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {referralData.topAffiliates.map((affiliate, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium admin-text-primary">{affiliate.code}</p>
                      <p className="text-sm admin-text-secondary">
                        {affiliate.count} referrals • {formatPrice(affiliate.commission)} commission
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold admin-text-primary">
                      {formatPrice(affiliate.revenue)}
                    </p>
                    <p className="text-xs admin-text-tertiary">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Performance Metrics */}
      <AdminCard>
        <div className="p-6">
          <h4 className="text-lg font-semibold mb-4">Performance Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h5 className="font-semibold admin-text-primary mb-1">Best Performing Source</h5>
              <p className="text-sm admin-text-secondary">
                {referralData.topSources[0]?.source || "N/A"}
              </p>
              <p className="text-xs admin-text-tertiary">
                {referralData.topSources[0]?.conversionRate.toFixed(1)}% conversion rate
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h5 className="font-semibold admin-text-primary mb-1">Highest Revenue</h5>
              <p className="text-sm admin-text-secondary">
                {referralData.topSources[0]?.source || "N/A"}
              </p>
              <p className="text-xs admin-text-tertiary">
                {formatPrice(referralData.topSources[0]?.revenue || 0)} generated
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h5 className="font-semibold admin-text-primary mb-1">Most Active Affiliate</h5>
              <p className="text-sm admin-text-secondary">
                {referralData.topAffiliates[0]?.code || "N/A"}
              </p>
              <p className="text-xs admin-text-tertiary">
                {referralData.topAffiliates[0]?.count || 0} referrals
              </p>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
};
