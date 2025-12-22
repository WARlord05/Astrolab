import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Info, Palette, Zap, Ruler } from 'lucide-react';
import { ZODIAC_SIGN_DETAILS, ZodiacSign } from '@/lib/astrology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ZodiacInfoPopoverProps {
  sign: ZodiacSign | undefined;
}

const ZodiacInfoPopover: React.FC<ZodiacInfoPopoverProps> = ({ sign }) => {
  if (!sign) return null;

  const details = ZODIAC_SIGN_DETAILS[sign];

  if (!details) return null;

  const getElementColor = (element: string) => {
    switch (element) {
      case 'Fire':
        return 'bg-red-500 hover:bg-red-600';
      case 'Earth':
        return 'bg-green-600 hover:bg-green-700';
      case 'Air':
        return 'bg-blue-400 hover:bg-blue-500';
      case 'Water':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-muted-foreground hover:text-primary">
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-none shadow-none">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-xl flex items-center justify-between">
              {sign}
              <Badge className={cn("text-white", getElementColor(details.element))}>
                {details.element}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{details.dates}</p>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <InfoItem icon={Palette} label="Ruling Planet" value={details.rulingPlanet} />
            <InfoItem icon={Zap} label="Quality" value={details.quality} />
            <InfoItem icon={Ruler} label="Traits" value={details.traits.join(', ')} />
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

const InfoItem: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-4 w-4 text-primary mt-1 shrink-0" />
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  </div>
);

export default ZodiacInfoPopover;