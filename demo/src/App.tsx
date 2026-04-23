import { createSignal } from 'solid-js';
import { Button } from '../../lib/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../lib/ui/Card';
import { Badge } from '../../lib/ui/Badge';
import { Input } from '../../lib/ui/Input';
import { Label } from '../../lib/ui/Label';
import { Switch } from '../../lib/ui/Switch';

export default function App() {
  const [isEdgeCase, setIsEdgeCase] = createSignal(false);

  return (
    <div class="min-h-screen p-8 md:p-16 flex flex-col gap-12 max-w-7xl mx-auto">
      <header class="border-b-4 border-black pb-8">
        <h1 class="text-6xl font-black uppercase tracking-tighter bg-yellow-400 inline-block px-4 py-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1 mb-4">
          Starling UI
        </h1>
        <p class="text-xl font-bold max-w-2xl mt-6">
          A brutalist-minimalist component library testing ground. Bold borders. Hard shadows. Unapologetic design.
        </p>
      </header>

      <main class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 bento-grid">
        {/* Bento Cell 1: Big Card */}
        <div class="md:col-span-2 md:row-span-2">
          <Card class="h-full border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white transition-transform hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader class="border-b-4 border-black bg-[#ffb800] p-6">
              <CardTitle class="text-4xl font-black uppercase">Primary Component</CardTitle>
              <CardDescription class="text-black font-bold text-lg mt-2">
                This is a massive brutalist card. It demands your attention.
              </CardDescription>
            </CardHeader>
            <CardContent class="p-8 flex flex-col gap-6">
              <div class="flex items-center space-x-2">
                <Label for="email" class="text-xl font-bold">Email</Label>
                <Input type="email" id="email" placeholder="Email" class="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow text-lg py-6" />
              </div>
              <div class="flex flex-wrap gap-4 mt-4">
                <Badge class="bg-[#ff4d4d] text-white border-2 border-black rounded-none text-lg px-4 py-1 uppercase font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff4d4d]">Urgent</Badge>
                <Badge class="bg-[#00e5ff] text-black border-2 border-black rounded-none text-lg px-4 py-1 uppercase font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#00e5ff]">System</Badge>
                <Badge variant="outline" class="border-2 border-black bg-white rounded-none text-lg px-4 py-1 uppercase font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Notice</Badge>
              </div>
            </CardContent>
            <CardFooter class="p-8 pt-0 flex justify-end">
              <Button class="bg-[#ff4d4d] hover:bg-[#ff3333] text-white border-4 border-black rounded-none text-xl font-black px-8 py-6 uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all">
                Submit Action
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Bento Cell 2: Controls */}
        <div class="md:col-span-1">
          <Card class="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#00e5ff]">
            <CardHeader class="p-6 pb-2">
              <CardTitle class="text-2xl font-black uppercase">Controls</CardTitle>
            </CardHeader>
            <CardContent class="p-6 flex flex-col gap-4">
              <Button variant="outline" class="w-full border-2 border-black rounded-none bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100">
                Secondary Action
              </Button>
              <Button variant="ghost" class="w-full border-2 border-dashed border-black rounded-none font-bold hover:bg-black/5">
                Tertiary Action
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bento Cell 3: Interactive Edge Cases */}
        <div class="md:col-span-1">
          <Card class="h-full border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-black text-white">
            <CardHeader class="border-b-4 border-white p-6">
              <CardTitle class="text-2xl font-black uppercase text-[#ffb800]">Edge Cases</CardTitle>
            </CardHeader>
            <CardContent class="p-6">
              <div class="flex items-center space-x-4 mb-6">
                <Switch id="edge-case-toggle" checked={isEdgeCase()} onChange={setIsEdgeCase} class="data-[state=checked]:bg-[#ff4d4d] border-2 border-white" />
                <Label for="edge-case-toggle" class="font-bold text-lg text-white">Enable Chaos</Label>
              </div>
              
              <div class="border-4 border-white bg-[#111] p-4 min-h-[120px] overflow-hidden relative">
                <p class={`font-mono text-sm break-all ${isEdgeCase() ? 'text-[#ff4d4d]' : 'text-[#00e5ff]'}`}>
                  {isEdgeCase() 
                    ? "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
                    : "Normal text string behaving correctly within container constraints."}
                </p>
                {isEdgeCase() && (
                   <Button class="absolute top-2 right-2 bg-[#ffb800] text-black border-2 border-white hover:bg-yellow-300 font-bold rounded-none z-10 w-[200px] shadow-[4px_4px_0px_0px_#fff]">
                     Extremely Long Button Text That Probably Overflows The Container Because It Is So Long
                   </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
