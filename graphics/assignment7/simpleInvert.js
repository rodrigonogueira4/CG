function simpleInvert(src, dst) {

      // COMPUTE ADJOINT COFACTOR MATRIX FOR THE ROTATION+SCALE 3x3

      for (var i = 0 ; i < 3 ; i++)
      for (var j = 0 ; j < 3 ; j++) {
         var i0 = (i+1) % 3;
         var i1 = (i+2) % 3;
         var j0 = (j+1) % 3;
         var j1 = (j+2) % 3;
         dst[j+4*i] = src[i0+4*j0] * src[i1+4*j1] - src[i0+4*j1] * src[i1+4*j0];
      }

      // RENORMALIZE BY DETERMINANT TO GET ROTATION+SCALE 3x3 INVERSE

      var determinant = src[0+4*0] * dst[0+4*0]
                      + src[1+4*0] * dst[0+4*1]
                      + src[2+4*0] * dst[0+4*2] ;
      for (var i = 0 ; i < 3 ; i++)
      for (var j = 0 ; j < 3 ; j++)
         dst[i+4*j] /= determinant;

      // COMPUTE INVERSE TRANSLATION

      for (var i = 0 ; i < 3 ; i++)
         dst[i+4*3] = - dst[i+4*0] * src[0+4*3]
                      - dst[i+4*1] * src[1+4*3]
                      - dst[i+4*2] * src[2+4*3] ;
}
