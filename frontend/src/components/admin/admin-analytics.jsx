"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useState } from "react";

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const analyticsData = {
    revenue: {
      current: 875000,
      previous: 780000,
      growth: 12.2,
    },
    orders: {
      current: 156,
      previous: 143,
      growth: 9.1,
    },
    customers: {
      current: 89,
      previous: 85,
      growth: 4.7,
    },
    avgOrderValue: {
      current: 5610,
      previous: 5450,
      growth: 2.9,
    },
  };

  const topProducts = [
    { name: "Rice 25kg", sales: 150, revenue: 225000, growth: 15.2 },
    { name: "Wheat Flour 10kg", sales: 200, revenue: 180000, growth: 8.7 },
    { name: "Cooking Oil 5L", sales: 80, revenue: 120000, growth: -5.3 },
    { name: "Sugar 1kg", sales: 300, revenue: 135000, growth: 12.1 },
    { name: "Dal 1kg", sales: 120, revenue: 108000, growth: 6.8 },
  ];

  const customerSegments = [
    { segment: "Premium Customers", count: 15, revenue: 450000, percentage: 51.4 },
    { segment: "Regular Customers", count: 35, revenue: 315000, percentage: 36.0 },
    { segment: "New Customers", count: 25, revenue: 87500, percentage: 10.0 },
    { segment: "Inactive Customers", count: 14, revenue: 22500, percentage: 2.6 },
  ];

  const monthlyTrends = [
    { month: "Jan", revenue: 650000, orders: 120 },
    { month: "Feb", revenue: 720000, orders: 135 },
    { month: "Mar", revenue: 780000, orders: 143 },
    { month: "Apr", revenue: 875000, orders: 156 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Detailed insights into your business performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{analyticsData.revenue.current.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+{analyticsData.revenue.growth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analyticsData.orders.current}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+{analyticsData.orders.growth}%</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{analyticsData.customers.current}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+{analyticsData.customers.growth}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">₹{analyticsData.avgOrderValue.current.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+{analyticsData.avgOrderValue.growth}%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                    <div className="flex items-center">
                      {product.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${product.growth > 0 ? "text-green-500" : "text-red-500"}`}>
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Revenue breakdown by customer type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{segment.segment}</span>
                    <span className="text-sm text-muted-foreground">{segment.count} customers</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${segment.percentage}%` }} />
                    </div>
                    <span className="text-sm font-medium">₹{segment.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Trends</CardTitle>
          <CardDescription>Revenue and order trends over the last 4 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {monthlyTrends.map((month, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{month.month}</h3>
                <p className="text-2xl font-bold text-blue-600">₹{(month.revenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">{month.orders} orders</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
