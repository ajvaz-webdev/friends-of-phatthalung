param([Parameter(Mandatory=$true)][string]$Source, [Parameter(Mandatory=$true)][string]$Output)
# User-approved removal of the generated checkerboard. Flood fill only reaches
# background pixels; enclosed white eye highlights and the original art remain.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies @('System.Drawing.Common','System.Drawing.Primitives','System.Private.Windows.GdiPlus','System.Private.Windows.Core','System.Runtime','System.Collections','System.Console') -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
public static class BuffaloSpriteCleanup {
  public static void Run(string input, string output) {
    using var original = new Bitmap(input);
    int w=original.Width,h=original.Height;
    using var cleaned=new Bitmap(w,h,PixelFormat.Format32bppArgb);
    using(var g=Graphics.FromImage(cleaned)) g.DrawImageUnscaled(original,0,0);
    var bg=new bool[w*h]; var visited=new bool[w*h];
    for(int y=0;y<h;y++) for(int x=0;x<w;x++) {
      var c=original.GetPixel(x,y);
      int lo=Math.Min(c.R,Math.Min(c.G,c.B)), hi=Math.Max(c.R,Math.Max(c.G,c.B));
      bg[y*w+x]=lo>203 && hi-lo<16;
    }
    var q=new Queue<int>();
    void Seed(int i) { if(bg[i]&&!visited[i]) { visited[i]=true; q.Enqueue(i); } }
    for(int x=0;x<w;x++) { Seed(x); Seed((h-1)*w+x); }
    for(int y=0;y<h;y++) { Seed(y*w); Seed(y*w+w-1); }
    while(q.Count>0) { int i=q.Dequeue(),x=i%w,y=i/w; cleaned.SetPixel(x,y,Color.Transparent);
      if(x>0) Seed(i-1); if(x<w-1) Seed(i+1); if(y>0) Seed(i-w); if(y<h-1) Seed(i+w);
    }
    // Explicit row separation keeps the tall victory horns intact.
    var regions=new Rectangle[] { new(30,65,375,315),new(470,65,400,315),new(920,65,395,315),new(1338,60,415,310),new(25,465,395,335),new(475,480,390,330),new(920,450,390,360),new(1360,390,390,420) };
    using var atlas=new Bitmap(768,384,PixelFormat.Format32bppArgb);
    using var draw=Graphics.FromImage(atlas);
    draw.InterpolationMode=System.Drawing.Drawing2D.InterpolationMode.NearestNeighbor;
    draw.PixelOffsetMode=System.Drawing.Drawing2D.PixelOffsetMode.Half;
    for(int n=0;n<8;n++) {
      var r=regions[n]; int l=r.Right,t=r.Bottom,rr=r.Left,b=r.Top;
      for(int y=r.Top;y<r.Bottom;y++) for(int x=r.Left;x<r.Right;x++) if(cleaned.GetPixel(x,y).A>0) { l=Math.Min(l,x);t=Math.Min(t,y);rr=Math.Max(rr,x);b=Math.Max(b,y); }
      var crop=new Rectangle(l,t,rr-l+1,b-t+1);
      const double scale=.43;
      int dw=(int)Math.Round(crop.Width*scale),dh=(int)Math.Round(crop.Height*scale);
      draw.DrawImage(cleaned,new Rectangle(n%4*192+(192-dw)/2,n/4*192+176-dh,dw,dh),crop,GraphicsUnit.Pixel);
    }
    atlas.Save(output,ImageFormat.Png);
    Console.WriteLine($"Saved RGBA atlas {atlas.Width}x{atlas.Height}; corner alpha {atlas.GetPixel(0,0).A}");
  }
}
'@
[BuffaloSpriteCleanup]::Run($Source, $Output)
