param([Parameter(Mandatory=$true)][string]$Source, [Parameter(Mandatory=$true)][string]$OutputDirectory, [ValidateSet('environment','sprites','landmarks')][string]$Mode = 'environment')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies @('System.Drawing.Common','System.Drawing.Primitives','System.Private.Windows.GdiPlus','System.Private.Windows.Core','System.Runtime','System.Collections','System.Console') -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
public static class AdventureArt {
  public static void Run(string input, string output, string mode) {
    using var source = new Bitmap(input);
    if(mode=="environment") {
      var encoder=Array.Find(ImageCodecInfo.GetImageEncoders(), e=>e.MimeType=="image/jpeg");
      using var settings=new EncoderParameters(1); settings.Param[0]=new EncoderParameter(Encoder.Quality,89L);
      for(int row=0;row<3;row++) {
        int top=row==0?0:row==1?341:683, bottom=row==0?341:row==1?683:1024;
        using var crop=source.Clone(new Rectangle(0,top,source.Width,bottom-top),PixelFormat.Format24bppRgb);
        crop.Save(Path.Combine(output,"route-"+row+".jpg"),encoder,settings);
      }
      Console.WriteLine("Saved three compressed, pixel-preserving panorama strips."); return;
    }
    // Run sprite/landmark mode only after the user approves precise checkerboard cleanup.
    int w=source.Width,h=source.Height;
    using var cleaned=new Bitmap(w,h,PixelFormat.Format32bppArgb);
    using(var g=Graphics.FromImage(cleaned)) g.DrawImageUnscaled(source,0,0);
    var bg=new bool[w*h]; var seen=new bool[w*h]; var q=new Queue<int>();
    for(int y=0;y<h;y++) for(int x=0;x<w;x++) {
      var c=source.GetPixel(x,y); int lo=Math.Min(c.R,Math.Min(c.G,c.B)),hi=Math.Max(c.R,Math.Max(c.G,c.B));
      bg[y*w+x]=lo>220 && hi-lo<16;
    }
    void Seed(int x,int y) { int i=y*w+x; if(bg[i]&&!seen[i]) {seen[i]=true;q.Enqueue(i);} }
    for(int x=0;x<w;x++){Seed(x,0);Seed(x,h-1);}
    for(int y=0;y<h;y++){Seed(0,y);Seed(w-1,y);}
    if(mode=="landmarks") { Seed(300,250); } // Visible opening in the mountain.
    while(q.Count>0) {
      int i=q.Dequeue(),x=i%w,y=i/w; cleaned.SetPixel(x,y,Color.Transparent);
      if(x>0)Seed(x-1,y);if(x<w-1)Seed(x+1,y);if(y>0)Seed(x,y-1);if(y<h-1)Seed(x,y+1);
    }
    Rectangle[] regions; string[] names;
    if(mode=="sprites") {
      names=new[]{"mango","durian","tea","mala","stickyRice","mooPing","bucket","coconut","khanom","chicken","goose","rider","pickup","motorbike","fruitCart","palm","house","fruitStall","person0","person1","person2","person3","person4","person5"};
      regions=new Rectangle[24];
      for(int i=0;i<12;i++) regions[i]=new Rectangle(i%6*256,i/6*240,256,240);
      // Explicit production crops preserve the original full silhouettes.
      regions[12]=new Rectangle(0,490,295,204);regions[13]=new Rectangle(300,490,212,204);
      for(int i=14;i<18;i++) regions[i]=new Rectangle(i%6*256,475,256,219);
      regions[15]=new Rectangle(768,475,205,219);
      regions[16]=new Rectangle(977,490,265,204);
      for(int i=18;i<24;i++) regions[i]=new Rectangle(i%6*256,694,256,330);
    } else {
      names=new[]{"mountain","sevenEleven","hall","dog","hay","irrigation"}; regions=new Rectangle[6];
      for(int i=0;i<6;i++)regions[i]=new Rectangle(i%3*512,i/3*512,512,512);
    }
    for(int n=0;n<names.Length;n++) {
      var r=regions[n]; int left=r.Right,top=r.Bottom,right=r.Left,bottom=r.Top;
      for(int y=r.Top;y<r.Bottom;y++)for(int x=r.Left;x<r.Right;x++)if(cleaned.GetPixel(x,y).A>0){left=Math.Min(left,x);top=Math.Min(top,y);right=Math.Max(right,x);bottom=Math.Max(bottom,y);}
      if(right<left)throw new Exception("Empty sprite: "+names[n]);
      using var crop=cleaned.Clone(new Rectangle(left,top,right-left+1,bottom-top+1),PixelFormat.Format32bppArgb);
      crop.Save(Path.Combine(output,names[n]+".png"),ImageFormat.Png);
      Console.WriteLine(names[n]+" "+crop.Width+"x"+crop.Height);
    }
  }
}
'@
[AdventureArt]::Run($Source, $OutputDirectory, $Mode)
