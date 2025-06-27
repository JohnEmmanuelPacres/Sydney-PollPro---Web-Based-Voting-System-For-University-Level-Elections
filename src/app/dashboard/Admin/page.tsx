'use client';
import { NextPage } from 'next';
import AdminHeader from '../../components/AdminHeader'; // Adjusted path
import ReviewElectionPanel from '../../components/ReviewElections'; // Adjusted path
import CreateElectionSection from '../../components/CreateElectionSection';
import YearDropdown from '../../components/YearDropDown';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAdminOrg } from './AdminedOrgContext';

const AdminDashboardNoSession: NextPage = () => {
	const searchParams = useSearchParams();
	const { setAdministeredOrg } = useAdminOrg();

	useEffect(() => {
	  const org = searchParams.get('administered_Org');
	  if (org) setAdministeredOrg(org);
	}, [searchParams, setAdministeredOrg]);

  	return (
    		<div style={{width: "100%", position: "relative", backgroundColor: "#52100d", height: "1717px", overflow: "hidden", textAlign: "left", fontSize: "20px", color: "#fef2f2", fontFamily: "Inter",}}>
      			<AdminHeader />
      			<div style={{position: "absolute", top: "650px", left: "calc(50% - 602px)", fontSize: "48px", letterSpacing: "-0.02em", fontWeight: "600", display: "inline-block", width: "390px",}}>Review Elections</div>
      			<div style={{position: "absolute", top: "750px", left: "100px", borderRadius: "20px", backgroundColor: "#fef2f2", border: "3px solid rgba(254, 242, 242, 0.96)", boxSizing: "border-box", width: "1165px", height: "666px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0px 14px 16px", gap: "16px", fontSize: "34px", color: "#000", fontFamily: "'Baloo 2'",}}>
        				<ReviewElectionPanel />
                        <ReviewElectionPanel />
                        <ReviewElectionPanel />
      			</div>
      			<YearDropdown/>
      			<div style={{position: "absolute", width: "100%", top: "1561px", right: "0px", left: "0px", boxShadow: "0px -5px 4px rgba(0, 0, 0, 0.5)", backgroundColor: "#5c1110", height: "156px", overflow: "hidden",}}>
        				<div style={{position: "absolute", top: "39px", left: "312px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",}}>
          					<div style={{width: "57px", position: "relative", height: "30px",}} />
        				</div>
      			</div>
      			<CreateElectionSection />
      			<div style={{position: "absolute", top: "696px", left: "665px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", borderRadius: "24px", backgroundColor: "#fef2f2", width: "470px", height: "34px",}} />
      			<div style={{position: "absolute", top: "184px", left: "269px", width: "827px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: "32px",}}>
        				<div style={{alignSelf: "stretch", position: "relative", fontWeight: "900", display: "inline-block", height: "55px", flexShrink: "0",}}>Powered by:</div>
        				<div style={{alignSelf: "stretch", position: "relative", fontSize: "128px", fontWeight: "900", textShadow: "5px 0 0 #5d0404, 0 5px 0 #5d0404, -5px 0 0 #5d0404, 0 -5px 0 #5d0404", marginTop: "-24px",}}>Sydney Polls</div>
      			</div>
    		</div>);
};

export default AdminDashboardNoSession;
