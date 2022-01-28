// 結晶構造描画クラス
class Waveplot {

    constructor(canvas) {
        // グローバル変数
        // 描画先オブジェクト
        this.canvas = canvas;
        this.lineWidth = 1.0;
        // パルス形状パラメータ (SALMON v.2.0.2)
        this.ae_shape1 = "Acos2";
        this.e_impulse = 0.0;
        this.e_amplitude1 = 0.0;
        this.i_wcm2_1 = 1e12;
        this.tw1 = 441.195136248;
        this.omega1 = 0.05696145187;
        this.epdir_re1 = {1:0.0, 2:0.0, 3:1.0};
        this.epdir_im1 = {1:0.0, 2:0.0, 3:0.0};
        this.phi_cep1 = 0.0;
        this.ae_shape2 = 0.0;
        this.e_amplitude2 = "none";
        this.i_wcm2_2 = 0.0;
        this.tw2 = 0.0;
        this.omega2 = 0.0;
        this.epdir_re2 = {1:0.0, 2:0.0, 3:0.0};
        this.epdir_im2 = {1:0.0, 2:0.0, 3:0.0};
        this.phi_cep2 = 0.0;
        this.t1_t2 = 0.0;
        this.t1_start = 0.0; 
    }

/*

  !
!  if(t0 < 0d0) return

  if(I_wcm2_1 < 0d0)then
    f0_1 = E_amplitude1
  else
    f0_1=5.338d-9*sqrt(I_wcm2_1)      ! electric field in a.u.
  end if
  if(I_wcm2_2 < 0d0)then
    f0_2 = E_amplitude2
  else
    f0_2=5.338d-9*sqrt(I_wcm2_2)      ! electric field in a.u.
  end if
  
  T1_T2_tmp = T1_T2

  select case(AE_shape1)
  case('impulse')
    do i=is, ie
      t=t0+i*delta_t
      if (0d0 <= t) then
        Ac_ext_t(1,i) = epdir_re1(1)*e_impulse
        Ac_ext_t(2,i) = epdir_re1(2)*e_impulse
        Ac_ext_t(3,i) = epdir_re1(3)*e_impulse
      end if
    end do
    
  case('Acos2','Acos3','Acos4','Acos6','Acos8')
  
    select case(ae_shape1)
    case('Acos2'); npower = 2
    case('Acos3'); npower = 3
    case('Acos4'); npower = 4
    case('Acos6'); npower = 6
    case('Acos8'); npower = 8
    case default
      stop 'Error in init_rt.f90'
    end select

    do i=is, ie
      t=t0+i*delta_t
      tt = t - 0.5d0*tw1 - t1_start
      if (abs(tt)<0.5d0*tw1) then
        Ac_ext_t(:,i) = -f0_1/omega1*(cos(pi*tt/tw1))**npower &
          *aimag( (epdir_re1(:) + zI*epdir_im1(:)) &
          *exp(zI*(omega1*tt+phi_CEP1*2d0*pi))  &
          )
      end if
    end do
    T1_T2_tmp = T1_T2 + t1_start

  case('Ecos2')
  
    if(phi_CEP1 /= 0.75d0)then
      stop "Error: phi_cep1 should be 0.75 when ae_shape1 is 'Ecos2'."
    end if
    if(sum(abs(epdir_im1(:)))>1.0d-8)then
      stop "Error: ae_shape1 should be 'Acos2' when epdir_im1 is used."
    end if
    do i=is, ie
      t=t0+i*delta_t
      tt = t - 0.5d0*tw1 - t1_start
      if (abs(tt)<0.5d0*tw1) then
        Ac_ext_t(:,i) = -epdir_re1(:)*f0_1/(8d0*pi**2*omega1 - 2d0*tw1**2*omega1**3) &
          *( &
          (-4d0*pi**2+tw1**2*omega1**2 + tw1**2*omega1**2*cos(2d0*pi*tt/tw1))*cos(omega1*tt) &
          +2d0*pi*(2d0*pi*cos(tw1*omega1/2d0) &
          +tw1*omega1*sin(2d0*pi*tt/tw1)*sin(omega1*tt)))
      end if
    end do
    T1_T2_tmp = T1_T2 + t1_start

  case('Esin2sin')
  
    stop "Esin2sin is not implemented"
    
  case('Asin2cos')
  
    ! pulse shape : A(t)=f0/omega*sin(Pi t/T)**2 *cos (omega t+phi_CEP*2d0*pi) 
    ! pump laser
    do i=is, ie
      t=t0+i*delta_t
      tt = t
      if (tt<tw1) then
        Ac_ext_t(:,i) = -epdir_re1(:)*f0_1/omega1*(sin(pi*tt/tw1))**2*cos(omega1*tt+phi_CEP1*2d0*pi)
      end if
    end do
    
  case('input')
     
    call add_Ac_from_file(trim(file_input1), t0, delta_t, is, ie, Ac_ext_t)
    !  stop "ae_shape1='input' is not implemented"
    
  case('Asin2_cw')
  
    ! pulse shape : A(t)=f0/omega*sin(Pi t/T)**2 *cos (omega t+phi_CEP*2d0*pi) 
    ! pump laser
    do i=is, ie
      t=t0+i*delta_t
      tt = t
      if (tt<tw1*0.5d0) then
        Ac_ext_t(:,i) = -Epdir_re1(:)*f0_1/omega1*(sin(pi*tt/tw1))**2*cos(omega1*tt+phi_CEP1*2d0*pi)
      else
        Ac_ext_t(:,i) = -Epdir_re1(:)*f0_1/omega1*cos(omega1*tt+phi_CEP1*2d0*pi)
      end if
    end do
    
  case('none')
  
    Ac_ext_t(:,:) = 0d0
    
  case default
  
    stop "Invalid pulse_shape_1 parameter!"
    
  end select

! Probe
  select case(ae_shape2)
  case('impulse')

    do i=is, ie
      t=t0+i*delta_t
      tt = t - 0.5d0*tw1 - T1_T2_tmp
      if(tt > 0d0)then
        Ac_ext_t(1,i) = Ac_ext_t(1,i) + epdir_re2(1)*e_impulse
        Ac_ext_t(2,i) = Ac_ext_t(2,i) + epdir_re2(2)*e_impulse
        Ac_ext_t(3,i) = Ac_ext_t(3,i) + epdir_re2(3)*e_impulse
      end if
    end do
    
  case('Acos2','Acos3','Acos4','Acos6','Acos8')
  
    select case(ae_shape2)
    case('Acos2'); npower = 2
    case('Acos3'); npower = 3
    case('Acos4'); npower = 4
    case('Acos6'); npower = 6
    case('Acos8'); npower = 8
    case default
      stop 'Error in init_Ac.f90'
    end select

    do i=is, ie
      t=t0+i*delta_t
      tt = t - 0.5d0*tw1 - T1_T2_tmp
      if (abs(tt)<0.5d0*tw2) then
        Ac_ext_t(:,i)=Ac_ext_t(:,i) &
          -f0_2/omega2*(cos(pi*tt/tw2))**npower &
          *aimag( (epdir_re2(:) + zI*epdir_im2(:)) &
          *exp(zI*(omega2*tt+phi_CEP2*2d0*pi))  &
          )
      end if
    end do

  case('Ecos2')
  
    if(phi_CEP2 /= 0.75d0)then
      stop "Error: phi_cep2 should be 0.75 when ae_shape2 is 'Ecos2'."
    end if
    if(sum(abs(epdir_im2(:)))>1.0d-8)then
      stop "Error: ae_shape2 should be 'Acos2' when epdir_im2 is used."
    end if

    do i=is, ie
      t=t0+i*delta_t
      tt = t - 0.5d0*tw1 - T1_T2_tmp
      if (abs(tt)<0.5d0*tw2) then
        Ac_ext_t(:,i)=Ac_ext_t(:,i) &
          -epdir_re2(:)*f0_2/(8d0*pi**2*omega2 - 2d0*tw2**2*omega2**3) &
          *( &
          (-4d0*pi**2+tw2**2*omega2**2 + tw2**2*omega2**2*cos(2d0*pi*tt/tw2))*cos(omega2*tt) &
          +2d0*pi*(2d0*pi*cos(tw2*omega2/2d0) &
          +tw2*omega2*sin(2d0*pi*tt/tw2)*sin(omega2*tt)))
      end if
    end do

  case('Esin2sin')
      
    stop "Esin2sin is not implemented"
    
  case('Asin2cos')
  
      ! pulse shape : A(t)=f0/omega*sin(Pi t/T)**2 *cos (omega t+phi_CEP*2d0*pi) 
    ! probe laser

    do i=is, ie
      t=t0+i*delta_t
      tt = t
      if ( (tt-T1_T2_tmp>0d0) .and. (tt-T1_T2_tmp<tw2) ) then
        Ac_ext_t(:,i) = Ac_ext_t(:,i) &
          &-Epdir_re2(:)*f0_2/omega2*(sin(pi*(tt-T1_T2_tmp)/tw2))**2*cos(omega2*(tt-T1_T2_tmp)+phi_CEP2*2d0*pi)
      endif
    end do

  case('input')
  case('Asin2_cw')
  case('none')
  case default
  
    stop "Invalid pulse_shape_2 parameter!"
    
  end select

  return
End Subroutine calc_Ac_ext_t
*/

    calc_Ac_ext_t(t0, delta_t, is, ie) {
 
        const pi = Math.PI;
        //   use salmon_global, only: I_wcm2_1,I_wcm2_2,E_amplitude1,E_amplitude2,ae_shape1,ae_shape2, &
        //                          & epdir_re1,epdir_re2,epdir_im1,epdir_im2,tw1,tw2,t1_start,omega1,omega2, &
        //                          & phi_CEP1,phi_CEP2,T1_T2,e_impulse,file_input1
        var I_wcm2_1 = this.i_wcm2_1
        var I_wcm2_2 = this.i_wcm2_2
        var E_amplitude1 = this.e_amplitude1
        var E_amplitude2 = this.e_amplitude2
        var ae_shape1 = this.ae_shape1
        var ae_shape2 = this.ae_shape2
        var epdir_re1 = this.epdir_re1
        var epdir_re2 = this.epdir_re2
        var epdir_im1 = this.epdir_im1
        var epdir_im2 = this.epdir_im2
        var tw1 = this.tw1
        var tw2 = this.tw2
        var t1_start = this.t1_start
        var omega1 = this.omega1
        var omega2 = this.omega2
        var phi_CEP1 = this.phi_cep1
        var phi_CEP2 = this.phi_cep2
        var T1_T2 = this.t1_t2
        var e_impulse = this.e_impulse

        // integer :: i,npower
        // real(8) :: t,f0_1,f0_2,tt,T1_T2_tmp
        // Ac_ext_t(:,:) = 0d0
        var i, npower;
        var t, f0_1, f0_2, tt, T1_T2_tmp;

        var Ac_ext_t = {
            1: new Float64Array(ie-is+1),
            2: new Float64Array(ie-is+1),
            3: new Float64Array(ie-is+1)
        };

        var errmsg = [];

        // if(I_wcm2_1 < 0d0)then
        //     f0_1 = E_amplitude1
        // else
        //     f0_1=5.338d-9*sqrt(I_wcm2_1)      ! electric field in a.u.
        // end if
        // if(I_wcm2_2 < 0d0)then
        //     f0_2 = E_amplitude2
        // else
        //     f0_2=5.338d-9*sqrt(I_wcm2_2)      ! electric field in a.u.
        // end if
        f0_1 = (I_wcm2_1 < 0) ? E_amplitude1 : 5.338e-9*Math.sqrt(I_wcm2_1);
        f0_2 = (I_wcm2_2 < 0) ? E_amplitude2 : 5.338e-9*Math.sqrt(I_wcm2_2);
        // T1_T2_tmp = T1_T2
        T1_T2_tmp = T1_T2;


        // select case(AE_shape1)
        switch (ae_shape1) {
        // case('impulse')
        case 'impulse':
            // do i=is, ie
            //     t=t0+i*delta_t
            //     if (0d0 <= t) then
            //     Ac_ext_t(1,i) = epdir_re1(1)*e_impulse
            //     Ac_ext_t(2,i) = epdir_re1(2)*e_impulse
            //     Ac_ext_t(3,i) = epdir_re1(3)*e_impulse
            //     end if
            // end do
            for (i=is; i<=ie; i++) {
                t=t0+i*delta_t
                if (0 <= t) {
                    Ac_ext_t[1][i] = epdir_re1[1]*e_impulse
                    Ac_ext_t[2][i] = epdir_re1[2]*e_impulse
                    Ac_ext_t[3][i] = epdir_re1[3]*e_impulse
                }
            }
            break;

        
        // case('Acos2','Acos3','Acos4','Acos6','Acos8')
        case 'Acos2':
        case 'Acos3':
        case 'Acos4':
        case 'Acos6':
        case 'Acos8':
            // select case(ae_shape1)
            // case('Acos2'); npower = 2
            // case('Acos3'); npower = 3
            // case('Acos4'); npower = 4
            // case('Acos6'); npower = 6
            // case('Acos8'); npower = 8
            // case default
            //   stop 'Error in init_rt.f90'
            // end select
            switch (ae_shape1) {
                case 'Acos2': npower = 2; break;
                case 'Acos3': npower = 3; break;
                case 'Acos4': npower = 4; break;
                case 'Acos6': npower = 6; break;
                case 'Acos8': npower = 8; break;
            }
        
            // do i=is, ie
            //   t=t0+i*delta_t
            //   tt = t - 0.5d0*tw1 - t1_start
            //   if (abs(tt)<0.5d0*tw1) then
            //     Ac_ext_t(:,i) = -f0_1/omega1*(cos(pi*tt/tw1))**npower &
            //       *aimag( (epdir_re1(:) + zI*epdir_im1(:)) &
            //       *exp(zI*(omega1*tt+phi_CEP1*2d0*pi))  &
            //       )
            //   end if
            // end do
            // T1_T2_tmp = T1_T2 + t1_start

            for (i=is; i<ie; i++) {
                t=t0+i*delta_t;
                tt = t - 0.5*tw1 - t1_start;
                if (Math.abs(tt)<0.5*tw1) {
                    var f_env = -f0_1/omega1*(Math.cos(pi*tt/tw1))**npower
                    var theta = (omega1*tt+phi_CEP1*2*pi)
                    for(var k=1; k<=3; k++)
                        Ac_ext_t[k][i] = f_env * (
                            epdir_re1[k] * Math.sin(theta)
                            + epdir_im1[k] * Math.cos(theta)
                        );
                }
            }
            T1_T2_tmp = T1_T2 + t1_start

            break;
            
        // case('Ecos2')
        case "Ecos2":
  
            // if(phi_CEP1 /= 0.75d0)then
            //   stop "Error: phi_cep1 should be 0.75 when ae_shape1 is 'Ecos2'."
            // end if
            // if(sum(abs(epdir_im1(:)))>1.0d-8)then
            //   stop "Error: ae_shape1 should be 'Acos2' when epdir_im1 is used."
            // end if
            // do i=is, ie
            //   t=t0+i*delta_t
            //   tt = t - 0.5d0*tw1 - t1_start
            //   if (abs(tt)<0.5d0*tw1) then
            //     Ac_ext_t(:,i) = -epdir_re1(:)*f0_1/(8d0*pi**2*omega1 - 2d0*tw1**2*omega1**3) &
            //       *( &
            //       (-4d0*pi**2+tw1**2*omega1**2 + tw1**2*omega1**2*cos(2d0*pi*tt/tw1))*cos(omega1*tt) &
            //       +2d0*pi*(2d0*pi*cos(tw1*omega1/2d0) &
            //       +tw1*omega1*sin(2d0*pi*tt/tw1)*sin(omega1*tt)))
            //   end if
            // end do


            
            // for (i=is; i<ie; i++) {
            //     t=t0+i*delta_t;
            //     tt = t - 0.5*tw1 - t1_start;
            //     if (Math.abs(tt)<0.5*tw1) {
            //         var f_env = -f0_1/omega1*(Math.cos(pi*tt/tw1))**npower
            //         var theta = (omega1*tt+phi_CEP1*2*pi)
            //         for(var k=1; k<=3; k++)

            //     }
            // }
            


        }
        

        return Ac_ext_t


    }



    

    plot() {
        // ローカル変数
        var height = this.canvas.offsetHeight;
        var width = this.canvas.offsetWidth;
        var ctx = this.canvas.getContext("2d");


        var Ac = this.calc_Ac_ext_t(0.0, 1.0, 0, 500);
        var acmax = Math.max.apply(null, Ac[3])
        var acmin = Math.min.apply(null, Ac[3])
        

        for (var i=0; i<500; i++) {
            var x = i * width / 500.0
            var y = (Ac[3][i] - acmin) / (acmax - acmin) * height ;
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.strokeStyle = "blue"; 
        ctx.lineWidth = 1;
        ctx.stroke();


    }
}
