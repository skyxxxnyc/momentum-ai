import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Building, MapPin, Users, Tag, Sparkles, Loader2 } from 'lucide-react';
import { ICP } from '@/lib/types';
interface IcpCardProps {
  icp: ICP;
  onEdit: () => void;
  onDelete: () => void;
  onFindLeads: () => void;
  isFindingLeads: boolean;
}
export function IcpCard({ icp, onEdit, onDelete, onFindLeads, isFindingLeads }: IcpCardProps) {
  return (
    <Card className="bg-card border-border/50 flex flex-col h-full">
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl text-momentum-slate">{icp.name}</CardTitle>
          <CardDescription className="text-momentum-dark-slate">Target Profile</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="flex items-start gap-3">
          <Building className="h-4 w-4 mt-1 text-momentum-dark-slate flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-momentum-light-slate">Industries</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {icp.industries.map(industry => <Badge key={industry} variant="secondary">{industry}</Badge>)}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Users className="h-4 w-4 mt-1 text-momentum-dark-slate flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-momentum-light-slate">Company Size</h4>
            <p className="text-sm text-momentum-slate">{icp.companySize[0].toLocaleString()} - {icp.companySize[1].toLocaleString()} employees</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 mt-1 text-momentum-dark-slate flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-momentum-light-slate">Location</h4>
            <p className="text-sm text-momentum-slate">{icp.location}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 w-full">
          <Tag className="h-4 w-4 mt-1 text-momentum-dark-slate flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-momentum-light-slate">Keywords</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {icp.keywords.map(keyword => <Badge key={keyword} variant="outline" className="border-momentum-cyan/20 text-momentum-cyan">{keyword}</Badge>)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onFindLeads} className="w-full" disabled={isFindingLeads}>
          {isFindingLeads ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Find Leads
        </Button>
      </CardFooter>
    </Card>
  );
}