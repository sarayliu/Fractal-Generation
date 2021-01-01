//
// Sara Liu, 15 January 2020
// Use Gimp or search up "ppm to png" to convert on laptop
//
#include <stdio.h>
#define M 640
#define N 480
//
int rgb[N][M][3] ; // red-green-blue for each pixel
double remin = -2.0 ;
double remax =  2.0 ;
double immin = -1.5 ;
double immax =  1.5 ;
//
int tmax = 10 ;
int f( double, double, int );
//
//------------------------------------------------------
//
int main(void)
{
   FILE* fout ;
   int x = 0 ;
   int y = 0 ;
   //
   int red , gre , blu, t ;
   //
   double re , im;
   //
   for(x = 0; x < M; x++)
   {
      for(y = 0 ; y < N ; y++ )   
      {
         re = remin + x * ( remax - remin ) / M ;
         im = immin + y * ( immax - immin ) / N ;
      //
         t = f( re , im , tmax ) ;
      //
         if( t == tmax )
         {
            red = 0 ;
            gre = 0 ;
            blu = 0 ;
         }
         else
         {
            red = 255 * t * 1.0 / tmax ;
            gre = 255 * t * 1.0 / tmax;
            blu = 255 * t * 1.0 / tmax;
         }
      //
         rgb[y][x][0] = red;
         rgb[y][x][1] = gre;
         rgb[y][x][2] = blu;
      }
   }
   fout = fopen( "lab11.ppm" , "w" ) ;
   
   fprintf( fout , "P3\n" ) ;
   fprintf( fout , "%d %d\n" , M , N ) ;
   fprintf( fout , "255\n" ) ;
   //
   for( y = 0 ; y < N ; y++ )
   {
      for( x = 0 ; x < M ; x++)
      {
         fprintf( fout , "%d %d %d\n" ,
            rgb[y][x][0] , rgb[y][x][1] , rgb[y][x][2] ) ;
      }
   }
   fclose( fout ) ;

   return 0;
}

int f( double re , double im , int n )
{
   int j = 0 ;
   //
   double a = 0 ;
   double b = 0 ;
   //
   double anew = 0 ;
   double bnew = 0 ;
   //
   while( j < n )
   {
      if( a*a + b*b > 4 ) 
      {
         break ;
      }
      //
      anew = a*a - b*b + re ;
      bnew = 2.0 * a * b + im ;
      //
      a = anew ;
      b = bnew ;
      //
      j++ ;
   }
   //
   return j ;
}
//
// end of file
//